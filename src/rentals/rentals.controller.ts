import { Controller } from '@nestjs/common';
import { RentalService } from './rentals.service';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalService) {}
}
