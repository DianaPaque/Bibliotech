import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
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

  //Bibliotecas

  @Post('createLibrary')
  async createLibrary(@Body() dto: CreateLibraryDto, requester_id: string): Promise<Library> {
    return await this.libraryService.createLibrary(dto, requester_id);
  }

  @Get('getAllLibraries')
  getAllLibraries() {
    return this.libraryService.getAllLibraries();
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

  @Delete('deleteBook/:libraryId/:bookId')
  deleteBook(@Param('libraryId') libraryId: string, @Param('bookId') bookId: string) {
    return this.libraryService.deleteBook(libraryId, bookId);
  }

  @Get('bookUnits/:bookId')
  getAvailableUnits(@Param('bookId') bookId: string) {
    return this.libraryService.getAvailableUnits(bookId);
  }

  @Put('updateUnits/:bookId/:increment')
  updateAvailableUnits(@Param('bookId') bookId: string,@Param('increment') increment: string) {
    return this.libraryService.updateAvailableUnits(bookId, Number(increment));
  }

  @Get('interestPercentage/:bookId')
  getLibraryInterestByBookId(@Param('bookId') bookId: string) {
    return this.libraryService.getLibraryInterestByBookId(bookId);
  }

  @Put('updateBook/:libraryId/:bookId')
  updateBook(@Param('libraryId') libraryId: string, @Param('bookId') bookId: string, @Body() dto: UpdateBookDto) {
  return this.libraryService.updateBook(libraryId, bookId, dto);
  }



}
