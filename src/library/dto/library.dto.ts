import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsInt } from 'class-validator';

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
  @IsNotEmpty()
  @IsString()
  libraryId: string;

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
  libraryId: string;

  @IsString()
  @IsNotEmpty()
  book_name: string;

  @IsString()
  @IsNotEmpty()
  book_description: string;

  @IsString()
  isbn: string;

  @IsNumber()
  existing_units: number;

  @IsBoolean()
  isAvailable: boolean;

  @IsNumber()
  specialCost: number;
}

export class UpdateBookDto {
  @IsNotEmpty()
  @IsString()
  bookId: string;

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
  @IsInt()
  existing_units?: number;

  @IsOptional()
  @IsNumber()
  specialCost?: number;
}


