import { Injectable } from '@nestjs/common';
import { UserMembership, UserMembershipDocument, UserMembershipSchema } from './schema/user-membership.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LibraryRole } from 'src/auth/guards/roles/library-roles.enum';

@Injectable()
export class MembershipService {
    constructor(@InjectModel(UserMembership.name) private membModel: Model<UserMembershipDocument>){}

    async hasMembership(user_id: string, library_id: string): Promise<boolean> {
        const membership = await this.membModel.findOne({ user_id, library_id }).lean();
        return !!membership;
    }

    async getRole(user_id: string, library_id: string): Promise<LibraryRole | null> {
        const membership = await this.membModel.findOne({ user_id, library_id }).lean();
        return membership?.role ?? null;
    }

    async hasRole(user_id: string, library_id: string, roles: LibraryRole[]): Promise<boolean> {
        const role = await this.getRole(user_id, library_id);
        return role ? roles.includes(role) : false;
    }


}
