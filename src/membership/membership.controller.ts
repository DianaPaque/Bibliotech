import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { LibraryRolesGuard } from 'src/auth/guards/roles/library-roles.guard';
import { LibraryRoles } from 'src/auth/guards/roles/library-roles.decorator';
import { LibraryRole } from 'src/auth/guards/roles/library-roles.enum';
import { UserMembership } from './schema/user-membership.schema';
import { CreateOrModifyMembershipDto } from './dto/membership.dto';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

    @UseGuards(JwtAuthGuard, LibraryRolesGuard)
    @LibraryRoles(LibraryRole.SuperAdmin)
    @Post('getAllLibraryMemberships/:library_id')
    async getAllLibraryMemberships(@Param('library_id')library_id: string): Promise<(UserMembership & { isOwner: boolean })[]> {
      return await this.membershipService.getAllLibraryMemberships(library_id);
    }

    @UseGuards(JwtAuthGuard, LibraryRolesGuard)
    @LibraryRoles(LibraryRole.SuperAdmin)
    @Post('createMembership')
    async createMembership(@Body() dto: CreateOrModifyMembershipDto): Promise<UserMembership> {
      return await this.membershipService.createMembership(dto);
    }

    @UseGuards(JwtAuthGuard, LibraryRolesGuard)
    @LibraryRoles(LibraryRole.SuperAdmin)
    @Put('modifyMembership')
    async modifyMembership(@Body() dto: CreateOrModifyMembershipDto, @Req() req): Promise<UserMembership | null> {
      return await this.membershipService.modifyMembership(req.user.user_id, dto);
    }

  @UseGuards(JwtAuthGuard, LibraryRolesGuard)
  @LibraryRoles(LibraryRole.SuperAdmin)
  @Delete('deleteMembership')
  async deleteMembership(@Body() dto: CreateOrModifyMembershipDto, @Req() req): Promise<void> {
    return await this.membershipService.deleteMembership(req.user.user_id,dto);
  }

}
