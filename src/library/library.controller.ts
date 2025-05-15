import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { CreateLibraryDto, UpdateLibraryDto } from './dto/library.dto';
import { Library } from './schema/library.schema';
import { LibraryRolesGuard } from 'src/auth/guards/roles/library-roles.guard';
import { LibraryRoles } from 'src/auth/guards/roles/library-roles.decorator';
import { LibraryRole } from 'src/auth/guards/roles/library-roles.enum';
import { UserRoles } from 'src/users/dto/users.dto';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createLibrary')
  async createLibrary(@Body() dto: CreateLibraryDto, requester_id: string): Promise<Library> {
    return await this.libraryService.createLibrary(dto, requester_id);
  }

  @Get('getAllLibraries')
  async getAllLibraries(): Promise<Library[]> {
    return await this.libraryService.getAllLibraries();
  }

  @UseGuards(JwtAuthGuard, LibraryRolesGuard)
  @LibraryRoles(LibraryRole.SuperAdmin)
  @Post('updateLibrary/:lib_id')
  async updateLibrary(@Body() dto: UpdateLibraryDto, @Param('lib_id') library_id: string): Promise<Library> {
    return await this.libraryService.updateLibrary(library_id, dto);
  }


  @UseGuards(JwtAuthGuard)
  @Delete('deleteLibrary/:library_id')
  async deleteLibrary(@Param('library_id') lib_id: string, @Req() req): Promise<void> {
    return await this.libraryService.deleteLibrary(lib_id, req.user.user_id);
  }

  @UseGuards(JwtAuthGuard, LibraryRolesGuard)
  @LibraryRoles(LibraryRole.SuperAdmin, LibraryRole.Admin)
  @Put('archiveBook/:book_id')
  async archiveBook(@Param('book_id') book_id: string, @Req() req): Promise<void> {
    return await this.libraryService.archiveBookManually(book_id, req.user.user_id);
  }

  @UseGuards(JwtAuthGuard, LibraryRolesGuard)
  @LibraryRoles(LibraryRole.SuperAdmin, LibraryRole.Admin)
  @Put('updateAvailableUnits/:book_id/:increment')
  async updateAvailableUnits(@Param('book_id') book_id: string, @Param('increment') increment: number, @Req() req): Promise<number> {
    return await this.libraryService.updateAvailableUnitsManually(book_id, increment, req.user.user_id);
  }



}
