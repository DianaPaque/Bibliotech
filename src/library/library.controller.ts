import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateLibraryDto, UpdateLibraryDto, CreateBookDto, UpdateBookDto } from './dto/library.dto';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  //Bibliotecas

  @Post('createLibrary')
  createLibrary(@Body() dto: CreateLibraryDto) {
    return this.libraryService.createLibrary(dto);
  }

  @Get('getAllLibraries')
  getAllLibraries() {
    return this.libraryService.getAllLibraries();
  }

  @Get('getLibraryById/:libraryId')
  getLibrary(@Param('libraryId') libraryId: string) {
    return this.libraryService.getLibraryById(libraryId);
  }

  @Put('updateLibrary/:libraryId')
  updateLibrary(@Param('libraryId') libraryId: string, @Body() dto: UpdateLibraryDto) {
    return this.libraryService.updateLibrary(libraryId, dto);
  }

  @Delete('deleteLibrary/:libraryId')
  deleteLibrary(@Param('libraryId') libraryId: string) {
    return this.libraryService.deleteLibrary(libraryId);
  }

  //Libros

  @Post('addNewBook/:libraryId')
  addBook(@Param('libraryId') libraryId: string, @Body() dto: CreateBookDto) {
    return this.libraryService.addBook(libraryId, dto);
  }

  @Get('getAllBooks/:libraryId')
  getBooks(@Param('libraryId') libraryId: string) {
    return this.libraryService.getBooks(libraryId);
  }

  @Get('getBookById/:libraryId/:bookId')
  getBook(@Param('libraryId') libraryId: string, @Param('bookId') bookId: string) {
    return this.libraryService.getBook(libraryId, bookId);
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
