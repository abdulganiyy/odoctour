import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { PrismaService } from 'src/prisma.service';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports:[BookingModule],
  controllers: [MeetingController],
  providers: [MeetingService,PrismaService],
  exports:[MeetingService]
})
export class MeetingModule {}
