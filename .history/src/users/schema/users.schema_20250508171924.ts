import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    @Prop({required: true})
    first_name: string; 

    @Prop({required: false})
    second_name: string;

    @Prop({required: true})
    first_last_name: string;

    @Prop({required: true})
    second_last_name: string;
}