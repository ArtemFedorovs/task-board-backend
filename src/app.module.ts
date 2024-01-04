import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BoardModule } from './board/board.module';
import { TaskModule } from './task/task.module';
import { dataSourceСonfig } from './config/data-source-config';
import { NotificationModule } from './notification/notification.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/all-exceptions.filter';
import { TerminusModule } from '@nestjs/terminus';
import { MonitoringModule } from './monitoring/monitoring.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      exclude: ['/api/(.*)'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSourceСonfig,
    }),
    UsersModule,
    BoardModule,
    TaskModule,
    NotificationModule,
    TerminusModule,
    MonitoringModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
