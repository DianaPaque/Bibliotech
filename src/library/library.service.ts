import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Library, LibraryDocument } from './schema/library.schema';
import { CreateBookDto, CreateLibraryDto, UpdateLibraryDto, UpdateBookDto } from './dto/library.dto';


@Injectable()
export class LibraryService {
  constructor(
    @InjectModel(Library.name) private libraryModel: Model<LibraryDocument>
  ) {}

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

  async updateBook(libraryId: string, bookId: string, dto: UpdateBookDto) {
    const lib = await this.libraryModel.findById(libraryId);
    if (!lib) throw new NotFoundException('Library not found');

    const book = lib.Books.find(b => b.book_id.toString() === bookId);
    if (!book) throw new NotFoundException('Book not found');

    Object.assign(book, dto);
    await lib.save();
    return book;
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
}
