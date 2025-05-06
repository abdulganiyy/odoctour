
import { Injectable, UnauthorizedException,BadRequestException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {compare, hash} from 'bcrypt'
import { RoleService } from 'src/role/role.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private roleService:RoleService,   private jwtService: JwtService,
   private emailService:EmailService
  ) {}

  async signIn(email: string, password: string): Promise<any> {

    const user = await this.usersService.findOne(email);

    if (!user) {
        throw new UnauthorizedException();
      }

    const passwordCorrect = await compare(password,user.password)

    if (!passwordCorrect) {
      throw new UnauthorizedException();
    }

 
    const payload = { userId: user.id, username: user.username,firstname: user.firstname,role:user.role.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
}


async signUp(email: string,firstname: string,lastname: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (user) {
      throw new BadRequestException('User already exists')
    }

    const passwordHash = await hash(pass,10)

    const userRole = await this.roleService.findOne('User') as {name:string,id:string}

   const newUser = await this.usersService.create({email,password:passwordHash,lastname,firstname,roleId:userRole.id})

 
    const payload = { userId: newUser.userId, username: newUser.username, firstname: newUser.firstname,role:userRole.name };

    await this.emailService.sendEmail(newUser.email,
      'Welcome to Our App!',
      'signup',
      {
        name: newUser.name,
        link: 'https://odoctour-frontend.vercel.app/dashboard',
      })

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
}

async forgotPassword(email: string): Promise<any> {
  const user = await this.usersService.findOne(email);

  if (!user) {
    throw new BadRequestException('User does notxs exist')
  }

  const token = await this.jwtService.signAsync({email}, {
    secret: process.env.JWT_SIGNING_SECRET,
    expiresIn:"1hr"
  })


   await this.emailService.sendEmail(email,
    'Reset Your Password',
    'reset-password',
    {name:user.firstname,
    resetLink: `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
    appName:'Odoctour'
    });

    return { message: 'Check your email for password reset link' }

}


async resetPassword(
 token: string,
newPassword: string,
) {

  try {
    const payload = this.jwtService.verify(token, {
      secret: process.env.JWT_SIGNING_SECRET,
    });

    const email = payload.email;

    const password = await hash(newPassword,10);

    
    await this.usersService.updatePassword({email,password})
    return { message: 'Password successfully reset' };

  } catch (error) {
    console.log(error)
    throw new UnauthorizedException('Invalid or expired reset token');
  }
}

}
