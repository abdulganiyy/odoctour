import { Controller,Post,HttpStatus,HttpCode,Body,Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUser } from './dto/create-user';

@Controller('user')
export class UserController {

    constructor(private userService: UserService){}


    @HttpCode(HttpStatus.CREATED)
    @Post()
    async  create(@Body() data: CreateUser) {

      return this.userService.createUser(data);
    }


      // @HttpCode(HttpStatus.CREATED)
      // @Post('doctor')
      // createDoctor(@Body() data: CreateDoctor) {
      //   return this.userService.createDoctor(data);
      // }

      @HttpCode(HttpStatus.OK)
      @Get()
      findAll() {
        return this.userService.findAll()
      }

}
