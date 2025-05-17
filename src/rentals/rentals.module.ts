import { Module } from '@nestjs/common';
import { RentalService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rental, RentalSchema } from './schema/rental.schema';
import { LibraryModule } from 'src/library/library.module';
import { UsersModule } from 'src/users/users.module';
import { MembershipModule } from 'src/membership/membership.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
  MongooseModule.forFeature([{name: Rental.name, schema: RentalSchema}]), 
  LibraryModule, 
  UsersModule, 
  MembershipModule, 
  NotificationsModule, 
  ScheduleModule.forRoot()],
  controllers: [RentalsController],
  providers: [RentalService],
})
export class RentalsModule {}
