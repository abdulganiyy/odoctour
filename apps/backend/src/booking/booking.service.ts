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

  findAll() {
    return this.prismaService.booking.findMany()
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
