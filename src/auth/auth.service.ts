import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LibraryService } from 'src/library/library.service';
import { MembershipService } from 'src/membership/membership.service';
@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private lib: LibraryService,
        private memb: MembershipService
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

    async canAccessBook(user_id: string, book_id: string): Promise<boolean> {
        const libraryId = await this.lib.getLibraryIdByBookId(book_id);

        const ownerId = await this.lib.getOwnerIdByLibraryId(libraryId);
        if (ownerId === user_id) return true;

        return await this.memb.hasMembership(user_id, libraryId);
    }



}
