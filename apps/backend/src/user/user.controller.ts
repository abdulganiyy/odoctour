import { Controller,Post,HttpStatus,HttpCode,Body,Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateDoctor } from './dto/create-doctor';

@Controller('user')
export class UserController {

    constructor(private userService: UserService){}


      @HttpCode(HttpStatus.CREATED)
      @Post('doctor')
      createDoctor(@Body() data: CreateDoctor) {
        return this.userService.createDoctor(data);
      }

      @HttpCode(HttpStatus.OK)
      @Get()
      findAll() {
        return this.userService.findAll()
      }

}
