import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { BoardModule } from './board/board.module';
import { TaskModule } from './task/task.module';
import { dataSourceСonfig } from './config/data-source-config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => dataSourceСonfig,
    }),
    UsersModule,
    BoardModule,
    TaskModule,
  ],
})
export class AppModule {}
