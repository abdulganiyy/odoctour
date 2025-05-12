import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from 'src/email/email.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { format } from 'date-fns';


@Injectable()
export class BookingService {

  constructor(private prismaService:PrismaService,private emailService:EmailService,@InjectQueue('meetingReminder') private meetingReminder:Queue){}

  async create(createBookingDto: CreateBookingDto) {

   const newBooking = await this.prismaService.booking.create({data:createBookingDto})

   const user = await this.prismaService.user.findUniqueOrThrow({
    include:{
      role:true
    },
    
    where:{
      id:createBookingDto.userId
    }
   })

   if(user.role.name !== 'User') throw new Error('User not authorised to perform this operation')

   const meeting = await this.prismaService.meeting.findUniqueOrThrow({
    select:{
      user:true,
      type:true,
      url:true,
    },
    where:{
      id:createBookingDto.meetingId
    }
   })

  await this.emailService.sendEmail(user.email,'Your Appointment is Confirmed','appointment-user',{
      userName: user.firstname,
      doctorName: meeting.user.firstname,
      appointmentTime: newBooking.time,
      mode: meeting.type,
      location: meeting.url,
      appName: 'Odoctor',
  })

  await this.emailService.sendEmail(meeting.user.email,`New Appointment Booked with ${user.firstname}`,'appointment-doctor',{
    userName: user.firstname,
    userEmail: user.email,
    doctorName: meeting.user.firstname,
    appointmentTime: newBooking.time,
    mode: meeting.type,
    location: meeting.url,
    appName: 'Odoctor'
})

const now = new Date();
const reminderTime = new Date(newBooking.time.getTime() - 30 * 60 * 1000);
const delay = reminderTime.getTime() - now.getTime();

const dateOnly = format(newBooking.time, 'MMMM d, yyyy');
const timeOnly = format(newBooking.time, 'hh:mm a');

if (delay > 0) {
  await this.meetingReminder.add('doctor-email-reminder',{
    doctorEmail:meeting.user.email,
    userName: user.firstname,
    userEmail: user.email,
    doctorName: meeting.user.firstname,
    appointmentDate: dateOnly,
    appointmentTime: timeOnly,
    mode: meeting.type,
    location: meeting.url,
    appName: 'Odoctor'
  },{delay})
  
  await this.meetingReminder.add('user-email-reminder',{
    userEmail:user.email,
    userName: user.firstname,
    doctorName: meeting.user.firstname,
    appointmentDate: dateOnly,
    appointmentTime: timeOnly,
    mode: meeting.type,
    location: meeting.url,
    appName: 'Odoctor',
  },{delay})
  
}



  return newBooking
  
  }

  findAll(user:any) {
    let role = user.role
    if(role == 'User'){
      return this.prismaService.booking.findMany({
        include:{
          meeting:true
        },
        where:{
          user:{
            id:user.userId
          },
        }
      })

    }else if(role == 'Doctor'){

      return this.prismaService.booking.findMany({
        include:{
          meeting:true
        },
        where:{
          meeting:{
            user:{
              id:user.userId
            }
          }
        }
      })


    }
    return this.prismaService.booking.findMany({   include:{
      meeting:true
    },})
  }

  findOne(id: string) {
    return this.prismaService.booking.findUnique({where:{id}})
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
