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


export class CreateUserDto {
    
}