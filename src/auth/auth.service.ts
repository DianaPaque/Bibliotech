import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LibraryService } from 'src/library/library.service';
import { MembershipService } from 'src/membership/membership.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly lib: LibraryService,
        private readonly memb: MembershipService,
    ) { }

    generateVerifCode(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async encryptPwd(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePwd(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    compareCodes(requestedCode: string, realCode: string | null): boolean {
        return requestedCode === realCode;
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
