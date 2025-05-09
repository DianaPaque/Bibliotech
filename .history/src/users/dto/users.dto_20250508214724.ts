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
    readonly _id: string;
    readonly name: string;
    readonly email: string;
    constructor(user: any) {
       this._id = user.id,
       
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