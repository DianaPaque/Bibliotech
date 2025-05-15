import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMembership, UserMembershipSchema } from './schema/user-membership.schema';

@Module({
  imports:[MongooseModule.forFeature([{name: UserMembership.name, schema: UserMembershipSchema }])],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports:[MembershipService]
})
export class MembershipModule {}
