import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {

  constructor(private prisma: PrismaService) {}
  
  
  findAll() {
    return this.prisma.role.findMany()
  }

  findOne(name:string) {
    return this.prisma.role.findFirst({
      where: {
        name
      },
    })
  }
}
