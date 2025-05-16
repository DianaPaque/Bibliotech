import { forwardRef, Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Library, LibrarySchema } from './schema/library.schema';
import { AuthModule } from 'src/auth/auth.module';
import { MembershipModule } from 'src/membership/membership.module';


@Module({
  imports: [
    MongooseModule.forFeature([{name: Library.name, schema: LibrarySchema}]), 
    forwardRef( () => AuthModule ),
    forwardRef( ()=> MembershipModule )
  ],
  controllers: [LibraryController],
  providers: [LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
