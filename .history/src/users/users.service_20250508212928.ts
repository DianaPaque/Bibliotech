import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel, Schema } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User as SchemaUser, User, UserDocument} from './schema/users.schema';
import { CreateUserDto } from './dto/users.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UsersService {
    constructor(@InjectModel(SchemaUser.name) private userModel: Model<UserDocument>, private notifier: NotificationsService, private auth: AuthService){}

    async createUser(dto: CreateUserDto) {
        
    }

}
