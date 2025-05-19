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

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) throw new ForbiddenException('Usuario no autenticado');

    let libraryId =
      req.body?.libraryId ||
      req.body?.library_id ||
      req.params?.libraryId ||
      req.params?.library_id ||
      req.query?.libraryId;

    if (!libraryId && req.params?.book_id) {
      libraryId = await this.libService.getLibraryIdByBookId(req.params.book_id);
    }


    if (!libraryId) throw new ForbiddenException('Falta el ID de la biblioteca');

    const ownerId = await this.libService.getOwnerIdByLibraryId(libraryId);

    if (user.user_id.toString() === ownerId.toString()) return true;

    const role = await this.membService.getRole(user.user_id, libraryId);

    if (!role || !requiredRoles.includes(role)) {
      throw new ForbiddenException('No tienes los permisos requeridos');
    }

    return true;
  }
}
