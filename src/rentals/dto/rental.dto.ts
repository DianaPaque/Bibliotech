import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRentalDto {
  @IsMongoId()
  @IsNotEmpty()
  bookId: string;

  @IsDateString()
  @IsNotEmpty()
  devolution_date: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class AcceptTurnInDto {
  @IsNotEmpty()
  @IsMongoId()
  customer_id: string;

  @IsNotEmpty()
  @IsMongoId()
  bookId: string;

  @IsNotEmpty()
  @IsMongoId()
  library_id: string;
}

export class RequestTurnInDto {
  @IsNotEmpty()
  @IsString()
  bookId: string;
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
