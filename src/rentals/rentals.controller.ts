import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { RentalService } from './rentals.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { CreateRentalDto } from './dto/rental.dto';
import { Rental } from './schema/rental.schema';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createRental')
  async createRental(@Body() dto: CreateRentalDto, @Req() req): Promise<Rental> {
    return await this.rentalsService.createRental(dto, req.user.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('turnInRental')
  async turnInRental(@Body() body: any, @Req() req): Promise<Rental> {
    return await this.rentalsService.turnInRental(req.user.user_id, body.book_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('cancelRental')
  async cancelRental(@Body() body: any, @Req() req): Promise<void> {
    return await this.rentalsService.cancelRental(req.user.user_id,body.book_id);
  }

}
