import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from 'src/prisma.service';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService,PrismaService,EmailService],
  exports:[BookingService]
})
export class BookingModule {}
