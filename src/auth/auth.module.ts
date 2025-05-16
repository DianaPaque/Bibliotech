import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { MembershipModule } from 'src/membership/membership.module';
import { LibraryModule } from 'src/library/library.module';
import { LibraryRolesGuard } from './guards/roles/library-roles.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1d' },
    }),

    MembershipModule,
    forwardRef(() => LibraryModule)
  ],
  controllers: [AuthController],
  providers: [AuthService, LibraryRolesGuard],
  exports:[AuthService]
})
export class AuthModule {}
