import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { LibraryModule } from './library/library.module';
import { RentalsModule } from './rentals/rentals.module';
import { MembershipModule } from './membership/membership.module';

@Module({
  imports: [UsersModule, AuthModule, DatabaseModule, NotificationsModule, 
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
    }),
    LibraryModule,
    RentalsModule,
    MembershipModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
