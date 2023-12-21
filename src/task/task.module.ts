import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from '../users/entities/user.entity';
import { Board } from '../board/entities/board.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtСonfig } from '../config/jwt-config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User, Board]),
    JwtModule.registerAsync({
      useFactory: () => jwtСonfig,
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
