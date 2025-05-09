import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(private configService = ConfigService){}
    generateVerifCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async encryptPwd(pwd: string): Promise<string> {
        return await bcrypt.hash(pwd,10);
    }

    async comparePwd(hashed_pwd: string, pwd: string): Promise<boolean> {
        return await bcrypt.compare()
    }




}
