import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LibraryRole } from 'src/auth/guards/roles/library-roles.enum';

@Schema({ timestamps: true })
export class UserMembership {
  @Prop({ type: Types.ObjectId, required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  library_id: Types.ObjectId;

  @Prop({ enum: LibraryRole, required: true })
  role: LibraryRole;

  @Prop({ type: Date, default: Date.now })
  memberSince: Date;
}

export type UserMembershipDocument = UserMembership & Document;
export const UserMembershipSchema = SchemaFactory.createForClass(UserMembership);
