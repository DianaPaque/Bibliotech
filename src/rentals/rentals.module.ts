import { Module } from '@nestjs/common';
import { RentalService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rental, RentalSchema } from './schema/rental.schema';
import { LibraryService } from 'src/library/library.service';

@Module({
  imports: [MongooseModule.forFeature([{name: Rental.name, schema: RentalSchema}])],
  controllers: [RentalsController],
  providers: [RentalService, LibraryService],
})
export class RentalsModule {}
