import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Task } from '../task/entities/task.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwtСonfig } from '../config/jwt-config';
import { MailerService } from '../core/mailer.service';
import { AuthGuard } from '../core/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Task]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => jwtСonfig,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, MailerService, AuthGuard],
})
export class UsersModule {}
