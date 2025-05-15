import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LIBRARY_ROLES_KEY } from './library-roles.decorator';
import { LibraryRole } from './library-roles.enum';
import { LibraryService } from 'src/library/library.service';
import { MembershipService } from 'src/membership/membership.service';

@Injectable()
export class LibraryRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly libService: LibraryService,
    private readonly membService: MembershipService,
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

    if (!user || !libraryId)
      throw new ForbiddenException('Missing user or library context');

    const ownerId = await this.libService.getOwnerIdByLibraryId(libraryId);
    if (ownerId === user.user_id) return true;

    const isAllowed = await this.membService.hasRole(user.user_id, libraryId, requiredRoles);
    if (!isAllowed)
      throw new ForbiddenException(`User lacks required role: ${requiredRoles.join(', ')}`);

    return true;
  }
}
