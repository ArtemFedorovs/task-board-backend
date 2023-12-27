import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Put,
  HttpException,
  Req,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard, ProtectedRequest } from '../core/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @Req() req: ProtectedRequest,
  ) {
    try {
      const createdBoard = await this.boardService.create(
        createBoardDto,
        req.headers.userId,
      );
      return { message: 'Board created successfully', board: createdBoard };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
