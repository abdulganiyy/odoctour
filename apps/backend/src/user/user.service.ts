
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDoctor } from './dto/create-doctor';
import { SignUp } from './dto/sign-up';
import { hash } from 'bcrypt';

type User = any


@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[] | undefined> {
    return this.prisma.user.findMany()
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({where:{email},include:{role:true}})
  }

  async create(data:SignUp): Promise<User | undefined> {
    return this.prisma.user.create({data})

  }

  async createDoctor(data:CreateDoctor): Promise<User | undefined> {

    let passwordHash = await hash(data.password,10)

    return this.prisma.user.create({data:{...data,password:passwordHash}})

  }

}
