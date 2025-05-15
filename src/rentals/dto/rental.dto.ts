import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRentalDto {
  @IsMongoId()
  @IsNotEmpty()
  bookId: string;

  @IsMongoId()
  @IsNotEmpty()
  customer_id: string;

  @IsDateString()
  @IsNotEmpty()
  devolution_date: string;
}

export class UpdateRentalDto {
  @IsOptional()
  @IsMongoId()
  bookId?: string;

  @IsOptional()
  @IsMongoId()
  customer_id?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  devolution_date?: string;

  @IsOptional()
  @IsNumber()
  lateBy?: number;

  @IsOptional()
  @IsNumber()
  accumulated_interest?: number;

  @IsOptional()
  @IsNumber()
  price_with_interest?: number;

  @IsOptional()
  @IsNumber()
  price_no_interest?: number;
}
