import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { LibraryRole } from "src/auth/guards/roles/library-roles.enum";

export class CreateOrModifyMembershipDto {
    @IsNotEmpty()
    @IsString()
    user_id: string;

    @IsNotEmpty()
    @IsString()
    library_id: string;

    @IsNotEmpty()
    @IsEnum(LibraryRole, {message: 'Rol inválido'})
    role: LibraryRole;
}