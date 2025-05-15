import { SetMetadata } from '@nestjs/common';
import { LibraryRole } from './roles/library-roles.enum';

export const LIBRARY_ROLES_KEY = 'library_roles';
export const LibraryRoles = (...roles: LibraryRole[]) => SetMetadata(LIBRARY_ROLES_KEY, roles);
