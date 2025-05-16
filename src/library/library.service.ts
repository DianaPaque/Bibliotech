import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Library, LibraryDocument } from './schema/library.schema';
import { CreateBookDto, CreateLibraryDto, UpdateLibraryDto, UpdateBookDto } from './dto/library.dto';
import { throws } from 'assert';


@Injectable()
export class LibraryService {
  constructor(
    @InjectModel(Library.name) private libraryModel: Model<LibraryDocument>
  ) { }

  async createLibrary(dto: CreateLibraryDto): Promise<Library> {
    const created = new this.libraryModel(dto);
    return created.save();
  }

  async getAllLibraries(): Promise<Library[]> {
    return this.libraryModel.find().lean();
  }

  async getLibraryById(libraryId: string): Promise<Library> {
    const library = await this.libraryModel.findById(libraryId).lean();
    if (!library) throw new NotFoundException('Library not found');
    return library;
  }

  async updateLibrary(dto: UpdateLibraryDto): Promise<Library> {
    const updated = await this.libraryModel.findByIdAndUpdate(
      dto.libraryId,
      dto,
      { new: true }
    );
    if (!updated) throw new NotFoundException('Library not found');
    return updated;
  }

  async deleteLibrary(libraryId: string): Promise<void> {
    const result = await this.libraryModel.findByIdAndDelete(libraryId);
    if (!result) throw new NotFoundException('Library not found');
  }

  async addBook(dto: CreateBookDto): Promise<Book> {
    const lib = await this.libraryModel.findById(dto.libraryId);
    if (!lib) throw new NotFoundException('Library not found');

    const newBook = {
      ...dto,
      book_id: new Types.ObjectId(),
    };

    lib.Books.push(newBook);
    await lib.save();
    return newBook;
  }

  async getBooks(libraryId: string) {
    const lib = await this.libraryModel.findById(libraryId).lean();
    if (!lib) throw new NotFoundException('Library not found');
    return lib.Books;
  }

  async getBook(libraryId: string, bookId: string) {
    const lib = await this.libraryModel.findById(libraryId).lean();
    if (!lib) throw new NotFoundException('Library not found');

    const book = lib.Books.find(b => b.book_id.toString() === bookId);
    if (!book) throw new NotFoundException('Book not found');

    return book;
  }

  async getAvailableUnits(bookId: string): Promise<number> {
  const bookObjectId = new Types.ObjectId(bookId);

  const lib = await this.libraryModel.findOne(
    { 'Books.book_id': bookObjectId },
    { 'Books.$': 1 }
  );

  if (!lib || !lib.Books || lib.Books.length === 0) {
    console.log('No se encontró el libro con book_id:', bookId);
    throw new NotFoundException('Book not found');
  }

  return lib.Books[0].existing_units;
  }

  async updateAvailableUnits(bookId: string, increment: number): Promise<number> {
    const bookObjectId = new Types.ObjectId(bookId);

    const book = await this.libraryModel.findOneAndUpdate(
      {'Books.book_id': new Types.ObjectId(bookId)},
      {$set: {'Books.$.existing_units': increment}},
      {new: true}
    );
    if(!book) throw new NotFoundException('Book not found');
    if(book.Books[0].existing_units === 0) await this.archiveBook(bookId);
    return book.Books[0].existing_units;
  }

  async updateAvailableUnitsManually(bookId: string, increment: number, requester_id: string): Promise<number> {
    if(!await this.auth.canAccessBook(requester_id,bookId)) throw new UnauthorizedException('No estás autorizado para archivar este libro');
    const book = await this.libraryModel.findOneAndUpdate(
      {'Books.book_id': new Types.ObjectId(bookId)},
      {$set: {'Books.$.existing_units': increment}},
      {new: true}
    );
    if(!book) throw new NotFoundException('Libro no encontrado');
    if(book.Books[0].existing_units === 0) await this.archiveBook(bookId);
    return book.Books[0].existing_units;
  }

  async deleteBook(libraryId: string, bookId: string): Promise<void> {
    const lib = await this.libraryModel.findById(libraryId);
    if (!lib) throw new NotFoundException('Library not found');

    const initialCount = lib.Books.length;
    lib.Books = lib.Books.filter(b => b.book_id.toString() !== bookId);

    if (lib.Books.length === initialCount)
      throw new NotFoundException('Book not found');

    await lib.save();
  }

  async archiveBook(bookId: string): Promise<void> {
    const book = await this.libraryModel.findOneAndUpdate(
      {'Books.book_id': bookId},
      {$set: {'Books.$.isAvailable': false}},
      {new: true}
    );
    if(!book) throw new NotFoundException('Libro no encontrado');
  }

  async archiveBookManually(bookId: string, requester_id: string): Promise<void> {
    if(!await this.auth.canAccessBook(requester_id,bookId)) throw new UnauthorizedException('No estás autorizado para archivar este libro');
    const book = await this.libraryModel.findOneAndUpdate(
      {'Books.book_id': new Types.ObjectId(bookId)},
      {$set: {'Books.$.isAvailable': false}},
      {new: true}
    );
    if(!book) throw new NotFoundException('Libro no encontrado');
  }

  async getLibraryInterestByBookId(bookId: string): Promise<number> {
    const bookObjectId = new Types.ObjectId(bookId);
    const book = await this.libraryModel.findOne(
      { 'Books.book_id': bookObjectId },
      { 'Books.$': 1, return_failure_interest: 1 }
    ).lean();

    if (!book) {
      throw new Error(`Book with ID ${bookId} not found in any library`);
    }

    return book.return_failure_interest;
  }

  async getLibraryIdByBookId(book_id: string): Promise<string> {
    const lib = await this.libraryModel.findOne(
      { 'Books.book_id': new Types.ObjectId(book_id) },
      { _id: 1 }
    ).lean();

    if (!lib) throw new NotFoundException('Book not found in any library');
    return lib._id.toString();
  }

  async getOwnerIdByLibraryId(libraryId: string): Promise<string> {
    const lib = await this.libraryModel.findById(libraryId, { owner_id: 1 }).lean();
    if (!lib) throw new Error('Library not found');
    return lib.owner_id.toString();
  }

  async updateBook(dto: UpdateBookDto, requester_id: string): Promise<Book> {
    if (!await this.auth.canAccessBook(requester_id, dto.bookId)) throw new UnauthorizedException('No estás autorizado para modificar este libro');

    const lib = await this.libraryModel.findOne({ 'Books.book_id': new Types.ObjectId(dto.bookId) });
    if (!lib) throw new NotFoundException('Biblioteca no encontrada');

    const book = lib.Books.find(b => b.book_id.toString() === dto.bookId);
    if (!book) throw new NotFoundException('Libro no encontrado');

    if (dto.book_name !== undefined) book.book_name = dto.book_name;
    if (dto.book_description !== undefined) book.book_description = dto.book_description;
    if (dto.isbn !== undefined) book.isbn = dto.isbn;
    if (dto.existing_units !== undefined) book.existing_units = dto.existing_units;
    if (dto.specialCost !== undefined) book.specialCost = dto.specialCost;

    await library.save();
    return book;
  }

}
