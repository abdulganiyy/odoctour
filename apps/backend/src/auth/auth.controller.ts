import { Body, Controller, Post, HttpCode, HttpStatus,Request ,Get,UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,private jwtService: JwtService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() signUpDto: Record<string, any>) {
    return this.authService.signUp(signUpDto.email,signUpDto.firstname,signUpDto.lastname, signUpDto.password,);
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  forgotPassword(@Body('email') email: string ){
    return this.authService.forgotPassword(email)
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  resetPassword(@Body('token') token: string,@Body('newPassword') newPassword:string ){
    return this.authService.resetPassword(token,newPassword)
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}