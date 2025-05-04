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

    const appointments = await this.prismaService.booking.findMany({
      include:{
        meeting:true
      },
      where:{
        user:{
          id:user.id
        },
      }
    })

    const meetings = await this.prismaService.meeting.findMany({
    
      where:{
        user:{
          id:user.id
        },
      }
    })

    const users = await this.prismaService.user.findMany()

    if(role == 'User'){

      return [
        {
          name:'Appointments',
          data: appointments.length
        }
      ]
      

    }else if(role == 'Doctor'){

      return [
        {
          name:'Meetings',
          data: meetings.length
        },
        {
          name:'Appointments',
          data: appointments.length
        }
      ]


    }
    return [
      {
        name:'Users',
        data: users.length
      },
      {
        name:'Meetings',
        data: meetings.length
      },
      {
        name:'Appointments',
        data: appointments.length
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
