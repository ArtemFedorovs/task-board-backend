import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BoardModule } from './board/board.module';
import { TaskModule } from './task/task.module';
import { dataSourceСonfig } from './config/data-source-config';
import { NotificationModule } from './notification/notification.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/all-exceptions.filter';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSourceСonfig,
    }),
    UsersModule,
    BoardModule,
    TaskModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
