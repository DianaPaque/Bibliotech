import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { CreateBookDto, CreateLibraryDto, UpdateBookDto, UpdateLibraryDto } from './dto/library.dto';
import { Book, Library } from './schema/library.schema';
import { LibraryRolesGuard } from 'src/auth/guards/roles/library-roles.guard';
import { LibraryRoles } from 'src/auth/guards/roles/library-roles.decorator';
import { LibraryRole } from 'src/auth/guards/roles/library-roles.enum';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) { }

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

  @UseGuards(JwtAuthGuard)
  @Get('getLibraryById/:libraryId')
  async getLibraryById(@Param('libraryId') libraryId: string): Promise<Library> {
    return await this.libraryService.getLibraryById(libraryId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getBooks/:libraryId')
  async getBooks(@Param('libraryId') libraryId: string) {
    return await this.libraryService.getBooks(libraryId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getBook/:libraryId/:bookId')
  async getBook(
    @Param('libraryId') libraryId: string,
    @Param('bookId') bookId: string
  ) {
    return await this.libraryService.getBook(libraryId, bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bookUnits/:bookId')
  async getBookUnits(@Param('bookId') bookId: string) {
    return await this.libraryService.getAvailableUnits(bookId);
  }

  @UseGuards(JwtAuthGuard, LibraryRolesGuard)
  @LibraryRoles(LibraryRole.SuperAdmin, LibraryRole.Admin)
  @Delete('deleteBook/:libraryId/:bookId')
  async deleteBook(
    @Param('libraryId') libraryId: string,
    @Param('bookId') bookId: string,
    @Req() req
  ) {
    return await this.libraryService.deleteBook(libraryId, bookId, req.user.user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('libraryInterest/:bookId')
  async getLibraryInterest(@Param('bookId') bookId: string) {
    return await this.libraryService.getLibraryInterestByBookId(bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('libraryIdByBook/:bookId')
  async getLibraryIdByBook(@Param('bookId') bookId: string) {
    return await this.libraryService.getLibraryIdByBookId(bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('ownerId/:libraryId')
  async getOwnerId(@Param('libraryId') libraryId: string) {
    return await this.libraryService.getOwnerIdByLibraryId(libraryId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('flatFee/:bookId')
  async getFlatFee(@Param('bookId') bookId: string) {
    return await this.libraryService.getLibraryFlatFeeByBookId(bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('specialCost/:bookId')
  async getSpecialCost(@Param('bookId') bookId: string) {
    return await this.libraryService.getSpecialCostByBookId(bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('bookById/:bookId')
  async getBookById(@Param('bookId') bookId: string) {
    return await this.libraryService.getBookById(bookId);
  }

}
