import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LIBRARY_ROLES_KEY } from './library-roles.decorator';
import { LibraryRole } from './library-roles.enum';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserMembership } from 'src/membership/schema/user-membership.schema';

@Injectable()
export class LibraryRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel('user_memberships') private membershipModel: Model<UserMembership>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<LibraryRole[]>(
      LIBRARY_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest() as any;
    const user = req.user;
    const libraryId = req.params.libraryId || req.body.libraryId;

    if (!user || !libraryId) throw new ForbiddenException('Missing user or library context');

    const membership = await this.membershipModel.findOne({
      user_id: user.user_id,
      library_id: libraryId,
    });

    if (!membership) throw new ForbiddenException('User is not a member of this library');

    if (!requiredRoles.includes(membership.role as LibraryRole)) {
      throw new ForbiddenException(`User lacks required role: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
