import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Put,
  HttpException,
  Headers,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard, TokenDataModel } from '../utility/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @Headers('userId') userId: string,
  ) {
    try {
      const createdBoard = await this.boardService.create(
        createBoardDto,
        +userId,
      );
      return { message: 'Board created successfully', board: createdBoard };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
