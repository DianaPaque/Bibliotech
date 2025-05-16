import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Rental {
  @Prop({ type: Types.ObjectId, required: true })
  bookId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  customer_id: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  start_date: Date;
  
  @Prop({ type: Date, required: true })
  devolution_date: Date;

  @Prop({ type: Number})
  amount: number;

  @Prop({type: Boolean, default: false})
  isTurnedIn: Boolean;

  @Prop({type: Boolean, default: false})
  isCancelled: Boolean;

  @Prop({type: Date})
  actual_devolution_date: Date;

  @Prop({ type: Number, default: 0 })
  lateBy: number;

  @Prop({ type: Number, default: 0 })
  accumulated_interest: number;

  @Prop({ type: Number, default: 0 })
  price_with_interest: number;

  @Prop({ type: Number, default: 0})
  final_price: number;

  @Prop({ type: Number, default: 0 })
  price_no_interest: number;
}

export type RentalDocument = Rental & Document;
export const RentalSchema = SchemaFactory.createForClass(Rental);
