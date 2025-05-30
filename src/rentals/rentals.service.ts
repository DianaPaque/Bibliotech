import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types} from 'mongoose';
import { Rental, RentalDocument } from './schema/rental.schema';
import { AcceptTurnInDto, CreateRentalDto, RequestTurnInDto, UpdateRentalDto } from './dto/rental.dto';
import { LibraryService } from 'src/library/library.service';
import { UsersService } from 'src/users/users.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Cron, CronExpression } from '@nestjs/schedule';
  
@Injectable()
export class RentalService implements OnModuleInit{
  constructor(
    @InjectModel(Rental.name) private rentalModel: Model<RentalDocument>,
    private readonly libService: LibraryService,
    private readonly usr: UsersService,
    private readonly notif: NotificationsService
  ) {}

  onModuleInit() {
    this.sendRelevantRentNotifs();
  }

  async createRental(dto: CreateRentalDto, requester_id: string): Promise<Rental> {
    if(!requester_id) throw new BadRequestException('Falta el id del usuario');
    const avail = await this.libService.getAvailableUnits(dto.bookId);
    const balance = await this.usr.getUserBalance(requester_id);
    //if( balance <= 0 || balance <= await this.libService.getLibraryFlatFeeByBookId(dto.bookId)) throw new ForbiddenException('No tiene balance suficiente para pagar.');
    if( avail === 0 || dto.amount > avail) throw new BadRequestException(`No hay suficientes unidades disponibles de este libro`);
    const rental = new this.rentalModel({
      ...dto,
      customer_id: requester_id,
      start_date: new Date(),
    });
    const current_avail = await this.libService.getAvailableUnits(dto.bookId);
    await this.libService.updateAvailableUnits(dto.bookId,(current_avail - dto.amount));
    return rental.save();
  }

  async getAllRentals(): Promise<Rental[]> {
    return this.rentalModel.find().lean();
  }

  async requestTurnIn(requester_id: string, dto: RequestTurnInDto): Promise<void> {
    if(!requester_id) throw new BadRequestException('Faltan parámetros');
    const rental = await this.rentalModel.findOne({customer_id: requester_id, bookId: dto.bookId});
    if(!rental) throw new NotFoundException('Renta no encontrada');
    rental.turnInRequested = true;
    await rental.save();
  }

  async acceptTurnIn(dto: AcceptTurnInDto): Promise<Rental> {
    const rental = await this.rentalModel.findOne({customer_id: dto.customer_id, bookId: dto.bookId});
    if(!rental) throw new NotFoundException('Renta no encontrada');
    if(rental.isTurnedIn) throw new ConflictException('Esta renta ya fue entregada');
    const today = new Date();
    if(this.isLate(rental.devolution_date,today)){ 
      const curr_strikes = await this.usr.getUserStrikes(dto.customer_id);
      await this.usr.setUserStrikes(dto.customer_id,(curr_strikes + 1));
    }

    let flat_fee: number;
    const specialCost = await this.libService.getSpecialCostByBookId(dto.bookId);
    if(specialCost !== 0) {
      flat_fee = specialCost;
    }
    else{
      flat_fee = await this.libService.getLibraryFlatFeeByBookId(dto.bookId);
    }
    
    if(await this.usr.getUserBalance(dto.customer_id) <= 0) throw new ForbiddenException('No tiene balance suficiente para pagar');
    const final_price = this.calculateLateFees(rental.devolution_date, today, await this.libService.getLibraryInterestByBookId(dto.bookId), flat_fee);
    rental.lateBy = this.lateBy(today, rental.devolution_date);
    rental.actual_devolution_date = today;
    rental.price_no_interest = flat_fee;
    rental.price_with_interest = final_price;
    rental.final_price = final_price;
    rental.accumulated_interest = (final_price - flat_fee); 
    rental.isTurnedIn = true;
    await this.usr.setUserBalance(dto.customer_id, (await this.usr.getUserBalance(dto.customer_id) - final_price));
    return await rental.save();
  }

  async getRentalById(id: string): Promise<Rental> {
    const rental = await this.rentalModel.findById(id).lean();
    if (!rental) throw new NotFoundException('Renta no encontrada');
    return rental;
  }

  async updateRental(id: string, dto: UpdateRentalDto): Promise<Rental> {
    const updated = await this.rentalModel.findByIdAndUpdate(
      id,
      dto,
      { new: true }
    );
    if (!updated) throw new NotFoundException('Renta no encontrada');
    return updated;
  }

  async cancelRental(requester_id: string, book_id: string): Promise<void> {
    if(!requester_id || !book_id) throw new BadRequestException('Faltan parámetros')
    const rental = await this.rentalModel.findOne({customer_id: requester_id, bookId: book_id});
    if(!rental) throw new NotFoundException('Renta no encontrada');
    if(requester_id !== rental.customer_id.toString()) throw new UnauthorizedException('Solo el usuario registrado en la renta puede cancelarla');
    const today = new Date();
    if(this.isLate(rental.devolution_date, today)) throw new UnauthorizedException('No puede cancelar su renta si está retrazado en la entrega de la misma');
    if(today === rental.devolution_date) throw new UnauthorizedException('No puede cancelar la renta el dia de entrega de la misma');
    rental.isCancelled = true;
    rental.save();
  }


  @Cron(CronExpression.EVERY_10_MINUTES)
  async sendRelevantRentNotifs(): Promise<void> {
    console.log('[RentalNotifier Active]')
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const rentals = await this.rentalModel.find({ isTurnedIn: false }).lean();
    if (!rentals || rentals.length === 0) return;

    for (const rental of rentals) {
      try {
        const dueDate = new Date(rental.devolution_date);
        const userEmail = await this.usr.getUserEmailById(rental.customer_id.toString());
        const book = await this.libService.getBookById(rental.bookId.toString());
        console.log('Sending email to: ',userEmail,' about book: ',book.book_name,' ',book.book_id);
        let subject = '';
        let text = '';

        if (dueDate < now) {
          subject = '¡Estás atrasado con un libro!';
          text = `Este es un recordatorio automático para avisarte que estás retrasado en la devolución del libro "${book.book_name}". Devuélvelo cuanto antes para evitar más cargos por intereses.`;
        } else if (
          dueDate.getFullYear() === tomorrow.getFullYear() &&
          dueDate.getMonth() === tomorrow.getMonth() &&
          dueDate.getDate() === tomorrow.getDate()
        ) {
          subject = 'Recordatorio: pronto vence tu renta';
          text = `Recuerda que el libro "${book.book_name}" debe ser devuelto mañana. Evita multas y retrasos devolviéndolo a tiempo.`;
        } else {
          continue; 
        }
        await this.notif.sendGenericEmail(userEmail, subject, text);
      } catch (err) {
        console.warn(`Error al notificar al usuario ${rental.customer_id}: ${err.message}`);
      }
    }
  }


  calculateLateFees(deadline: Date, today: Date, interest_rate: number, og_payment: number): number {
    if(this.isLate(deadline,today)){
      const late_by = this.lateBy(today,deadline);
      return parseFloat((og_payment * Math.pow(1+(interest_rate/100),late_by)).toFixed(2));
    }
    return og_payment;
  }

  isLate(deadline: Date, today: Date): boolean {
    return today > deadline;
  }

  lateBy(today: Date, deadline: Date): number {
    return Math.floor((today.getTime() - deadline.getTime())/86400000);
  }


}
