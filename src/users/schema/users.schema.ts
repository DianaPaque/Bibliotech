import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { UserRoles } from '../dto/users.dto';
import { Document } from 'mongoose';
export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    @Prop({required: true})
    first_name: string; 

    @Prop({required: false})
    second_name?: string;

    @Prop({required: true})
    first_last_name: string;

    @Prop({required: true})
    second_last_name: string;

    @Prop({type: Number, default: 0})
    strikes: number;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    pwd_hash: string;

    @Prop({required: true, maxlength:15})
    phone_number: string;

    @Prop({required: false, maxlength: 6})
    verificationCode?: string;

    @Prop({required: false})
    isVerified?: boolean;

    @Prop({required: false, default: 0})
    balance: number;

    @Prop({ required: true, enum: UserRoles, default: UserRoles.Customer })
    role: UserRoles;

}

export const UserSchema = SchemaFactory.createForClass(User);