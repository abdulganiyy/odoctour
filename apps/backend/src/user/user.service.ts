
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUser } from './dto/create-user';
import { SignUp } from './dto/sign-up';
import { hash } from 'bcrypt';
import { EmailService } from 'src/email/email.service';

type User = any


@Injectable()
export class UserService {

  constructor(private prisma: PrismaService,private emailService:EmailService) {}

  async findAll(): Promise<User[] | undefined> {
    return this.prisma.user.findMany({
      include:{
        role:true,
        profilePicture:true
      }
    })
  }

  async findDoctorMeetings(){

    const doctors = await this.prisma.user.findMany({
      where:{role:{name:"Doctor"}},
      include:{
        role:true,
        profilePicture:true
      }
    })

  return   await Promise.all(doctors.map(async (doctor)=>{
      
      const meeting = await this.prisma.meeting.findFirst({where:{userId:doctor.id}})

      return {
        ...doctor,
        meeting
      }
    }))

  }

  async findOne(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({where:{email},include:{role:true}})
  }

  async create(data:CreateUser): Promise<User | undefined> {

    return this.prisma.user.create({data})

  }

  async createUser(data:CreateUser): Promise<User | undefined> {

    let passwordHash = await hash(data.password,10)

    const {link,...userPayload} = data;


   const user = await this.prisma.user.create({data:{...userPayload,password:passwordHash}})

    const role = await this.prisma.role.findUniqueOrThrow({where:{id:data.roleId}})


    if(role.name == 'Doctor'){

      await this.prisma.meeting.create({data:{name:"Consultation Appointment",
        type:'Virtual',
        url:link,
        duration:30,
        userId:user.id}})

      await this.emailService.sendEmail(data.email,`Your Odoctor Doctor Account Has Been Created`,'account-creation',{
      
        userName: `Dr. ${data.firstname} ${data.lastname}`,
        userEmail: data.email,
        userRole: "Doctor",
        temporaryPassword: data.password,
        loginUrl: `${process.env.FRONTEND_URL}/signin`,
        appName: "Odoctor",
        appDomain: "odoctour-frontend.vercel.app"
        })
    }

   

    return {message:"New User created successfully"};

  }

  async updatePassword(data:User): Promise<User | undefined> {

    return  this.prisma.user.update({
      where: { email:data.email },
      data: { password: data.password },
    });
  }

}
