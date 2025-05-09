import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsOptional,
    IsPhoneNumber,
    IsEnum
  } from 'class-validator';

export enum UserRoles { 
    Customer = 'Customer',
    Admin = 'Admin',
    SuperAdmin = 'SuperAdmin'
}


export class SanitizedUser {
    constructor(user: any) {
        readonly _id: string;
    }
}

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsOptional()
    @IsString()
    second_name?: string;

    @IsNotEmpty()
    @IsString()
    first_last_name: string;

    @IsNotEmpty()
    @IsString()
    second_last_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    phone_number: string;


}