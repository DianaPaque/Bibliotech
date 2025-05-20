import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { RentalService } from './rentals.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { AcceptTurnInDto, CreateRentalDto, RequestTurnInDto } from './dto/rental.dto';
import { Rental } from './schema/rental.schema';
import { LibraryRoles } from 'src/auth/guards/roles/library-roles.decorator';
import { LibraryRole } from 'src/auth/guards/roles/library-roles.enum';
import { LibraryRolesGuard } from 'src/auth/guards/roles/library-roles.guard';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createRental')
  async createRental(@Body() dto: CreateRentalDto, @Req() req): Promise<Rental> {
    return await this.rentalsService.createRental(dto, req.user.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('requestTurnIn')
  async requestTurnIn(@Req() req, @Body() dto: RequestTurnInDto): Promise<void> {
    await this.rentalsService.requestTurnIn(req.user.user_id, dto);
  }

  @UseGuards(JwtAuthGuard, LibraryRolesGuard)
  @LibraryRoles(LibraryRole.Admin, LibraryRole.SuperAdmin)
  @Put('acceptTurnIn')
  async acceptTurnIn(@Body() dto: AcceptTurnInDto): Promise<Rental> {
    return await this.rentalsService.acceptTurnIn(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('cancelRental')
  async cancelRental(@Body() body: any, @Req() req): Promise<void> {
    return await this.rentalsService.cancelRental(req.user.user_id,body.book_id);
  }

}
