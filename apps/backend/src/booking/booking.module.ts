import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from 'src/prisma.service';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { BullModule } from '@nestjs/bull';
import BookingReminder from './booking.process';

@Module({
  imports:[BullModule.registerQueue({name:"meetingReminder"}),EmailModule],
  controllers: [BookingController],
  providers: [BookingService,PrismaService,BookingReminder],
  exports:[BookingService]
})
export class BookingModule {}
