import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { RoleModule } from 'src/role/role.module';
import { EmailModule } from 'src/email/email.module';


@Module({
  imports:[UserModule,RoleModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '1d' },
  }),EmailModule],
  controllers: [AuthController],
  providers: [AuthService],
})

export class AuthModule {}
