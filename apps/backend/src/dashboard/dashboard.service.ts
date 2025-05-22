import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { UpdateDashboardDto } from './dto/update-dashboard.dto';
import { UserService } from 'src/user/user.service';
import { MeetingService } from 'src/meeting/meeting.service';
import { BookingService } from 'src/booking/booking.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DashboardService {

  constructor(private prismaService:PrismaService,private userService:UserService,private meetingService:MeetingService,private bookingService:BookingService){}

  create(createDashboardDto: CreateDashboardDto) {
    return 'This action adds a new dashboard';
  }

  async findAll(user:any) {
    let role = user.role;
    let userId = user.userId

    const appointments = await this.prismaService.booking.findMany()

    const meetings = await this.prismaService.meeting.findMany()

    const users = await this.prismaService.user.findMany()

    // console.log(appointments,meetings);

    if(role == 'User'){

      const appointments = await this.prismaService.booking.findMany({
        include:{
          meeting:true
        },
        where:{
          user:{
            id:user.userId
          },
        }
      })

      return [
        {
          name:'Appointments',
          data: appointments.length ?? 0
        }
      ]
      

    }else if(role == 'Doctor'){

      const meetings = await this.prismaService.meeting.findMany({
        include:{user:true},
          where:{
            user:{
              id:user.userId
            },
          }
        })

        const appointments = await this.prismaService.booking.findMany({
  
          where:{
            meeting:{
              userId
            }
          }
        })

      return [
        {
          name:'Meetings',
          data: meetings.length ?? 0
        },
        {
          name:'Appointments',
          data: appointments.length ?? 0
        }
      ]


    }
    return [
      {
        name:'Users',
        data: users.length ?? 0
      },
      {
        name:'Meetings',
        data: meetings.length ?? 0
      },
      {
        name:'Appointments',
        data: appointments.length ?? 0
      }
    ]
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  update(id: number, updateDashboardDto: UpdateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }
}
