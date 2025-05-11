import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { MeetingModule } from './meeting/meeting.module';
import { BookingModule } from './booking/booking.module';
import { S3Service } from './s3/s3.service';
import { DocumentModule } from './document/document.module';
import { ConfigService } from '@nestjs/config';
import { UuidService } from './uuid/uuid.service';
import { EmailModule } from './email/email.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BullModule } from '@nestjs/bull';



@Module({
  imports: [UserModule, AuthModule, RoleModule, MeetingModule, BookingModule, DocumentModule, EmailModule, DashboardModule,
    BullModule.forRoot({redis:{host:process.env.REDIS_HOST,port: 19295,username:process.env.REDIS_USERNAME ,
      password: process.env.REDIS_PASSWORD,}})],
  controllers: [AppController],
  providers: [AppService, S3Service,ConfigService, UuidService],
})
export class AppModule {}
