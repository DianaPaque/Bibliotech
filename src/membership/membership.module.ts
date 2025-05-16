import { forwardRef, Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMembership, UserMembershipSchema } from './schema/user-membership.schema';
import { LibraryModule } from 'src/library/library.module';
import { UsersModule } from 'src/users/users.module';
console.log('Users Module: ' + UsersModule)
@Module({
  imports:[
    MongooseModule.forFeature([{name: UserMembership.name, schema: UserMembershipSchema }]), 
    forwardRef( () => LibraryModule ), 
    forwardRef ( () => UsersModule )
],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports:[MembershipService]
})
export class MembershipModule {}
