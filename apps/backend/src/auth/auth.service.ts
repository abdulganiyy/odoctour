
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

}
