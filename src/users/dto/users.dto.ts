import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsOptional,
    IsPhoneNumber,
    IsEnum,
    MaxLength,
    isEmail,
    IsLowercase
} from 'class-validator';

export enum UserRoles { 
    Customer = 'Customer',
    Admin = 'Admin',
    SuperAdmin = 'SuperAdmin'
}
export class SanitizedUser {
    readonly _id: string;
    readonly first_name: string;
    readonly second_name: string | null;
    readonly first_last_name: string;
    readonly second_last_name: string;
    readonly email: string;
    constructor(user: any) {
        this._id = user._id;
        this.first_name = user.first_name;
        this.second_name = user.second_name;
        this.first_last_name = user.first_last_name;
        this.second_last_name = user.second_last_name;
        this.email = user.email;
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
    @IsLowercase()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsPhoneNumber()
    @IsNotEmpty()
    phone_number: string;
}
export class VerifyLoginOrRegisterDto {
    @IsNotEmpty()
    @IsLowercase()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(6)
    verif_code: string;
}
export class LoginDto {
    @IsNotEmpty()
    @IsLowercase()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}