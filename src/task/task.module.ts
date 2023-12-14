import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { JwtModule } from '@nestjs/jwt';
import appConfig from '../config/app.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: appConfig().jwtSecretString,
        global: true,
        signOptions: { expiresIn: '660s' },
      }),
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
