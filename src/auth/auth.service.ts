import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService
    ){}

    generateVerifCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async encryptPwd(pwd: string): Promise<string> {
        return await bcrypt.hash(pwd,10);
    }

    async comparePwd(pwd: string, hashed_pwd: string): Promise<boolean> {
        return await bcrypt.compare(pwd,hashed_pwd);
    }

    compareCodes(req_code: string, real_code: string | null): boolean {
        if(req_code !== real_code) return false;
        return true;
    }
    
    generateJwt(payload: any): string {
        return this.jwtService.sign(payload);
    }    
}
