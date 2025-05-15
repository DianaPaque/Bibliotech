import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { Rental, RentalDocument } from './schema/rental.schema';
import { CreateRentalDto, UpdateRentalDto } from './dto/rental.dto';
import { LibraryService } from 'src/library/library.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RentalService {
  constructor(
    @InjectModel(Rental.name) private rentalModel: Model<RentalDocument>,
    private readonly libService: LibraryService,
  ) {}

  async createRental(dto: CreateRentalDto): Promise<Rental> {
    if(await this.libService.getAvailableUnits(dto.bookId) === 0) throw new BadRequestException(`There's no available unit for this book.`);
    const rental = new this.rentalModel({
      ...dto,
      start_date: new Date(),
    });
    const current_avail = await this.libService.getAvailableUnits(dto.bookId);
    await this.libService.updateAvailableUnits(dto.bookId,(current_avail - 1));
    return rental.save();
  }

  async getAllRentals(): Promise<Rental[]> {
    return this.rentalModel.find().lean();
  }

  async getRentalById(id: string): Promise<Rental> {
    const rental = await this.rentalModel.findById(id).lean();
    if (!rental) throw new NotFoundException('Rental not found');
    return rental;
  }

  async updateRental(id: string, dto: UpdateRentalDto): Promise<Rental> {
    const updated = await this.rentalModel.findByIdAndUpdate(
      id,
      dto,
      { new: true }
    );
    if (!updated) throw new NotFoundException('Rental not found');
    return updated;
  }

  async deleteRental(requester_id: string, id: string): Promise<void> {
    const auth = await this.rentalModel.findById(id);
    if(!auth) throw new NotFoundException('Rental not found');
    if(auth.customer_id.toString() !== requester_id) throw new UnauthorizedException('Only the user themselves can cancel a rental.'); 
    const result = await this.rentalModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Rental not found');
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async applyLateFees() {
    const now = new Date();
    const overdueRentals = await this.rentalModel.find({
      isTurnedIn: false,
      devolution_date: { $lt: now },
    });

    for (const rental of overdueRentals) {
      const overdueDays = Math.floor(
        (now.getTime() - rental.devolution_date.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (overdueDays > rental.lateBy) {
        const newDaysLate = overdueDays - rental.lateBy;

        const interestRate = await this.libService.getLibraryInterestByBookId(rental.bookId.toString());
        const additionalInterest = rental.price_no_interest * interestRate * newDaysLate;

        rental.lateBy = overdueDays;
        rental.accumulated_interest += additionalInterest;
        rental.price_with_interest = rental.price_no_interest + rental.accumulated_interest;

        await rental.save();
      }
    }
  }


}
