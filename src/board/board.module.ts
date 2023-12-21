import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Board } from './entities/board.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtСonfig } from '../config/jwt-config';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, User]),
    JwtModule.registerAsync({
      useFactory: () => jwtСonfig,
    }),
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
