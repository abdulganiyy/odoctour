import { Controller, Get,UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}


  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.roleService.findAll()
  }


}
