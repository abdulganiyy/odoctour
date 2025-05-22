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
    return this.prismaService.meeting.create({data:createMeetingDto});
  }

  findAll(user:any) {

    let role = user.role

    if(role == 'Doctor'){

      return this.prismaService.meeting.findMany({
       
        where:{
            user:{
              id:user.userId
            }
        }
      })


    }
    return this.prismaService.meeting.findMany();
  }

  findBookings (meetingId:string){
     return this.prismaService.booking.findMany({where:{meetingId}});
  }

  findOne(id: string) {
    return this.prismaService.meeting.findUnique({include:{user:{include:{profilePicture:{select:{url:true}}}},availabilitySlots:true},where:{id}});
  }

  async update(id: string, updateMeetingDto: UpdateMeetingDto) {

    const {availability,...payload} = updateMeetingDto

    // await this.prismaService.availability.updateMany({where:{meetingId:id},data:availability})
    // await this.prismaService.$transaction(
    //   availability.map((item:any) =>
    //     this.prismaService.availability.upsert({
    //       where: {
    //         dayOfWeek:item.dayOfWeek,
    //         // id:'',
    //         meetingId:id
    //       },
    //       update: {
    //         canBook: item.canBook,
    //         startTime: item.startTime,
    //         endTime: item.endTime,
    //       },
    //       create: {
    //         meetingId: id,
    //         dayOfWeek: item.dayOfWeek,
    //         canBook: item.canBook,
    //         startTime: item.startTime,
    //         endTime: item.endTime,
    //       },
    //     })
    //   )
    // );

    for (const item  of availability) {
      const existing = await this.prismaService.availability.findFirst({
        where: {
          meetingId:id,
          dayOfWeek: (item as any).dayOfWeek,
        },
      });
    
      if (!existing) {
        await this.prismaService.availability.create({
          data: {
            meetingId:id,
            dayOfWeek: (item as any).dayOfWeek,
            canBook: (item as any).canBook,
            startTime: (item as any).startTime,
            endTime: (item as any).endTime,
          },
        });
      }else{
        await this.prismaService.availability.update({where:{id:existing.id},
          data: {
            meetingId:id,
            dayOfWeek: (item as any).dayOfWeek,
            canBook: (item as any).canBook,
            startTime: (item as any).startTime,
            endTime: (item as any).endTime,
          },
        });
      }
    }
    

    return this.prismaService.meeting.update({where:{id},data:payload})


  }

  remove(id: number) {
    return `This action removes a #${id} meeting`;
  }
}
