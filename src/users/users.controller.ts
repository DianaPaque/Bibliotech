import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, SanitizedUser, VerifyLoginOrRegisterDto } from './dto/users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(@Body() dto: CreateUserDto): Promise<SanitizedUser> {
    return await this.usersService.createUser(dto);
  }

  @Post('/verifyRegister')
  async verifyRegister(@Body() dto: VerifyLoginOrRegisterDto): Promise<string> {
    return await this.usersService.verifyRegister(dto);
  }
  
}
