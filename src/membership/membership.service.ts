import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserMembership, UserMembershipDocument, UserMembershipSchema } from './schema/user-membership.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LibraryRole } from 'src/auth/guards/roles/library-roles.enum';
import { CreateOrModifyMembershipDto } from './dto/membership.dto';
import { LibraryService } from 'src/library/library.service';
import { UsersService } from 'src/users/users.service';

const LibraryRoleHierarchy: Record<LibraryRole, number> = {
        [LibraryRole.Customer]: 1,
        [LibraryRole.Admin]: 2,
        [LibraryRole.SuperAdmin]: 3,
};

@Injectable()
export class MembershipService {
    constructor(
        @InjectModel(UserMembership.name) private membModel: Model<UserMembershipDocument>,
        private readonly lib: LibraryService,
        @Inject(forwardRef(() => UsersService)) private readonly usr: UsersService    
    ){}

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

   async getAllLibraryMemberships(library_id: string): Promise<(UserMembership & { isOwner: boolean })[]> {
        const ownerId = await this.lib.getOwnerIdByLibraryId(library_id);

        const memberships = await this.membModel.find({
            library_id: new Types.ObjectId(library_id)
        }).lean();
        const allMembers = [
            ...memberships.map(m => ({ ...m, isOwner: false })),
            {
            user_id: new Types.ObjectId(ownerId),
            library_id: new Types.ObjectId(library_id),
            role: LibraryRole.SuperAdmin,
            memberSince: new Date(), 
            isOwner: true
            }
        ];
        return allMembers;
    }   

    async createMembership(dto: CreateOrModifyMembershipDto): Promise<UserMembership> {
        if(!await this.lib.libraryExists(dto.library_id)) throw new NotFoundException('Biblioteca no existe');
        if(!await this.usr.userExists(dto.user_id)) throw new NotFoundException('Usuario no existe');
        return await this.membModel.create({...dto});
    }

    async modifyMembership(requester_id: string, dto: CreateOrModifyMembershipDto): Promise<UserMembership | null> {
        if(requester_id === dto.user_id) throw new UnauthorizedException('No puede modificar su propio rol');
        const requester_role = await this.getRole(requester_id, dto.library_id);
        if(!requester_role) throw new NotFoundException('Rol no encontrado para usuario solicitante');
        const user_role = await this.getRole(dto.user_id,dto.library_id);
        if(!user_role) throw new NotFoundException('Rol no encontrado para usuario a actualizar');
        if(LibraryRoleHierarchy[requester_role] <= LibraryRoleHierarchy[dto.role]) throw new UnauthorizedException('No puede asignar roles superiores al suyo');
        if(LibraryRoleHierarchy[requester_role] <= LibraryRoleHierarchy[user_role]) throw new UnauthorizedException('No puede modificar el rol de usuarios con un rol superior al suyo');
        const updated = this.membModel.findOneAndUpdate({library_id: new Types.ObjectId(dto.library_id), user_id: new Types.ObjectId(dto.user_id)},{$set: {role: dto.role}},{new: true});
        if(!updated) throw new NotFoundException('Membresía no encontrada');
        return updated;
    }

    async deleteMembership(requester_id: string, dto: CreateOrModifyMembershipDto): Promise<void> {
        if(requester_id === dto.user_id) throw new UnauthorizedException('No puede eliminar su propia membresía');
        const requester_role = await this.getRole(requester_id, dto.library_id);
        if(!requester_role) throw new NotFoundException('Rol no encontrado para usuario solicitante');
        const target_role = await this.getRole(dto.user_id, dto.library_id);
        if(!target_role) throw new NotFoundException('Rol no encontrado para usuario a eliminar');
        if(LibraryRoleHierarchy[requester_role] <= LibraryRoleHierarchy[target_role]) throw new UnauthorizedException('No puede eliminar usuarios con rol igual o superior al suyo');
        const result = await this.membModel.findOneAndDelete({
            user_id: new Types.ObjectId(dto.user_id),
            library_id: new Types.ObjectId(dto.library_id)
        });
        if(!result) throw new NotFoundException('Membresía no encontrada');
    }


}



