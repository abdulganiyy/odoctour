import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UserModule } from 'src/user/user.module';
import { MeetingModule } from 'src/meeting/meeting.module';
import { BookingModule } from 'src/booking/booking.module';
import { PrismaService } from 'src/prisma.service';


@Module({
  imports:[UserModule,MeetingModule,BookingModule],
  controllers: [DashboardController],
  providers: [DashboardService,PrismaService],
})
export class DashboardModule {}
