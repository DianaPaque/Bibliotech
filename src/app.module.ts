import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [UsersModule, UsersModule, DatabaseModule, NotificationsModule, ConfigModule.forRoot({isGlobal: true}),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
