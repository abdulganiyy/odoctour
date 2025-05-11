import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { PrismaService } from 'src/prisma.service';
import { BookingModule } from 'src/booking/booking.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports:[BookingModule,BullModule.registerQueue({name:"meetingReminder"})],
  controllers: [MeetingController],
  providers: [MeetingService,PrismaService],
  exports:[MeetingService]
})
export class MeetingModule {}
