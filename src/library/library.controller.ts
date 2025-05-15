import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { CreateBookDto, CreateLibraryDto, UpdateBookDto, UpdateLibraryDto } from './dto/library.dto';
import { Book, Library } from './schema/library.schema';
import { LibraryRolesGuard } from 'src/auth/guards/roles/library-roles.guard';
import { LibraryRoles } from 'src/auth/guards/roles/library-roles.decorator';
import { LibraryRole } from 'src/auth/guards/roles/library-roles.enum';
import { UserRoles } from 'src/users/dto/users.dto';

@Controller('library')  
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createLibrary')
  async createLibrary(@Body() dto: CreateLibraryDto, @Req() req): Promise<Library> {
    return await this.libraryService.createLibrary(dto, req.user.user_id);
  }

  @Get('getAllLibraries')
  async getAllLibraries(): Promise<Library[]> {
    return await this.libraryService.getAllLibraries();
  }

  @UseGuards(JwtAuthGuard, LibraryRolesGuard)
  @LibraryRoles(LibraryRole.SuperAdmin)
  @Post('updateLibrary')
  async updateLibrary(@Body() dto: UpdateLibraryDto): Promise<Library> {
    return await this.libraryService.updateLibrary(dto);
  }


  @UseGuards(JwtAuthGuard)
  @Delete('deleteLibrary/:libraryId')
  async deleteLibrary(@Param('libraryId') libraryId: string, @Req() req): Promise<void> {
    return await this.libraryService.deleteLibrary(libraryId, req.user.user_id);
  }

  @UseGuards(JwtAuthGuard, LibraryRolesGuard)
  @LibraryRoles(LibraryRole.SuperAdmin, LibraryRole.Admin)
  @Post('createBook')
  async createBook(@Body() dto: CreateBookDto): Promise<Book> {
    return await this.libraryService.addBook(dto);
  }

  @UseGuards(JwtAuthGuard, LibraryRolesGuard)
  @LibraryRoles(LibraryRole.SuperAdmin, LibraryRole.Admin)
  @Put('archiveBook/:book_id/:libraryId')
  async archiveBook(@Param('book_id') book_id: string, @Req() req): Promise<void> {
    return await this.libraryService.archiveBookManually(book_id, req.user.user_id);
  }

  @UseGuards(JwtAuthGuard, LibraryRolesGuard)
  @LibraryRoles(LibraryRole.SuperAdmin, LibraryRole.Admin)
  @Put('updateAvailableUnits/:book_id/:increment')
  async updateAvailableUnits(@Param('book_id') book_id: string, @Param('increment') increment: number, @Req() req): Promise<number> {
    return await this.libraryService.updateAvailableUnitsManually(book_id, increment, req.user.user_id);
  }

  @UseGuards(JwtAuthGuard, LibraryRolesGuard)
  @LibraryRoles(LibraryRole.SuperAdmin, LibraryRole.Admin)
  @Put('updateBook')
  async updateBook(@Body() dto: UpdateBookDto, @Req() req): Promise<Book> {
    return await this.libraryService.updateBook(dto, req.user.user_id);
  }


}
