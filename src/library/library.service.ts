import { Injectable, NotFoundException } from '@nestjs/common';
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

  async updateLibrary(libraryId: string, dto: UpdateLibraryDto): Promise<Library> {
    const updated = await this.libraryModel.findByIdAndUpdate(
      libraryId,
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

  async addBook(libraryId: string, dto: CreateBookDto) {
    const lib = await this.libraryModel.findById(libraryId);
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
      { 'Books.book_id': bookObjectId },
      { $set: { 'Books.$.existing_units': increment } },
      { new: true }
    );

    if (!book || !book.Books || book.Books.length === 0) {
      throw new NotFoundException('Book not found');
    }

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

  async updateBook(libraryId: string, bookId: string, dto: UpdateBookDto) {
    const library = await this.libraryModel.findById(libraryId);
    if (!library) throw new NotFoundException('Library not found');

    const book = library.Books.find(b => b.book_id.toString() === bookId);
    if (!book) throw new NotFoundException('Book not found');

    Object.assign(book, dto);

    await library.save();
    return book;
  }

}
