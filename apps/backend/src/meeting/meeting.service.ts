import { Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { PrismaService } from 'src/prisma.service';
import { BookingService } from 'src/booking/booking.service';

@Injectable()
export class MeetingService {

  constructor(private prismaService: PrismaService,private bookingService: BookingService){

  }

  create(createMeetingDto: CreateMeetingDto) {
    return this.prismaService.meeting.create({data:createMeetingDto})
  }

  findAll() {
    return this.prismaService.meeting.findMany()
  }

  findBookings (meetingId:string){
     return this.prismaService.booking.findMany({where:{meetingId}})
  }

  findOne(id: string) {
    return this.prismaService.meeting.findUnique({where:{id}})
  }

  update(id: number, updateMeetingDto: UpdateMeetingDto) {
    return `This action updates a #${id} meeting`;
  }

  remove(id: number) {
    return `This action removes a #${id} meeting`;
  }
}
