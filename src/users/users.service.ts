import { ConflictException, Injectable, NotFoundException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel, Schema } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User as SchemaUser, User, UserDocument} from './schema/users.schema';
import { CreateUserDto, SanitizedUser, VerifyLoginOrRegisterDto, LoginDto } from './dto/users.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { AuthService } from 'src/auth/auth.service';
import { NotFoundError } from 'rxjs';
@Injectable()
export class UsersService{
    constructor(@InjectModel(SchemaUser.name) private userModel: Model<UserDocument>, private notifier: NotificationsService, private auth: AuthService, private configService: ConfigService){}

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
            phone_number: dto.phone_number,
            pwd_hash: hashed_pwd,
            verificationCode: verif_code,
        });
        await this.notifier.sendEmailVerifCode(dto.email,verif_code);

        const createdUser = await newUser.save();
        return new SanitizedUser(createdUser);
    }

    async verifyRegister(dto: VerifyLoginOrRegisterDto): Promise<string> {
        const existingUser = await this.userModel.findOne({email: dto.email}).exec();
        if(!existingUser) throw new NotFoundException('El usuario que estás intentando verificar no existe.');
        if(existingUser.isVerified) throw new ConflictException('Este usuario ya está verificado.');
        if(!this.auth.compareCodes(dto.verif_code,existingUser.verificationCode as string)) throw new UnauthorizedException('Los código de verificación no coinciden.');

        const isverifiedex = await this.userModel.updateOne({email: dto.email}, {isVerified: true});
        return 'isVerified = true';
    }

    async login(dto: LoginDto): Promise<{token: string}> {
        const user = await this.userModel.findOne({ email: dto.email }).exec();

        if (!user) throw new NotFoundException('Usuario no encontrado');
        if (!user.isVerified) throw new UnauthorizedException('Usuario no verificado');

        const passwordMatch = await this.auth.comparePwd(dto.password, user.pwd_hash);
        if (!passwordMatch) throw new UnauthorizedException('Contraseña incorrecta');

        const token = await this.auth.generateJwt({ sub: user._id, email: user.email, role: 'Customer' });
        return { token };
    }
}
