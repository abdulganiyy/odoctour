import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BookingService {

  constructor(private prismaService:PrismaService){}

  create(createBookingDto: CreateBookingDto) {
    return this.prismaService.booking.create({data:createBookingDto})
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
            id:user.id
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
