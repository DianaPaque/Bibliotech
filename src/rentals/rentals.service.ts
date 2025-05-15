import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rental, RentalDocument } from './schema/rental.schema';
import { CreateRentalDto, UpdateRentalDto } from './dto/rental.dto';

@Injectable()
export class RentalService {
  constructor(
    @InjectModel(Rental.name) private rentalModel: Model<RentalDocument>
  ) {}

  async createRental(dto: CreateRentalDto): Promise<Rental> {
    const rental = new this.rentalModel({
      ...dto,
      start_date: new Date(),
    });
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

  async deleteRental(id: string): Promise<void> {
    const result = await this.rentalModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Rental not found');
  }
}
