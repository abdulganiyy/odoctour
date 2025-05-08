import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { RoleModule } from 'src/role/role.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports:[RoleModule,EmailModule],
  controllers: [UserController],
  providers: [UserService,PrismaService],
  exports:[UserService]
})
export class UserModule {}
