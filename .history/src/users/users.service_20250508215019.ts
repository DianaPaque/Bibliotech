import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel, Schema } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User as SchemaUser, User, UserDocument} from './schema/users.schema';
import { CreateUserDto, SanitizedUser } from './dto/users.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UsersService {
    constructor(@InjectModel(SchemaUser.name) private userModel: Model<UserDocument>, private notifier: NotificationsService, private auth: AuthService){}

    async createUser(dto: CreateUserDto): Promise<SanitizedUser> {
        const existingUser = await this.userModel.findOne({email: dto.email}).exec();
        if(existingUser) throw new ConflictException('Este correo ya está registrado.');

        const hashed_pwd = await this.auth.encryptPwd(dto.password);
        const verif_code = this.auth.generateVerifCode();

        const newUser = new this.userModel({
            first_name: dto.first_name,
            second_name: dto.second_name,
            first_last_name: dto.first_last_name,
            second_last_name: dto.second_last_name,
            email: dto.email,
            pwd_hash: hashed_pwd,
            verificationCode: verif_code,
        });

        const sanitizedUser = await newUser.save();
    }

}
