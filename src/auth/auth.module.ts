import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { MembershipModule } from 'src/membership/membership.module';
import { LibraryModule } from 'src/library/library.module';
import { LibraryRolesGuard } from './guards/roles/library-roles.guard';
import { JwtStrategy } from './guards/jwt/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        //signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => MembershipModule),
    forwardRef(() => LibraryModule)
  ],
  controllers: [AuthController],
  providers: [AuthService, LibraryRolesGuard, JwtStrategy],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
