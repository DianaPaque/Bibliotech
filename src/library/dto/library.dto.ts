import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateLibraryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  return_failure_interest: number;
}

export class UpdateLibraryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  return_failure_interest?: number;
}

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  book_name: string;

  @IsString()
  @IsNotEmpty()
  book_description: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsNumber()
  existing_units: number;

  @IsBoolean()
  isAvailable: boolean;

  @IsNumber()
  specialCost: number;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  book_name?: string;

  @IsOptional()
  @IsString()
  book_description?: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsNumber()
  existing_units?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  specialCost?: number;
}


