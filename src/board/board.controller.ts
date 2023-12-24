import { Controller, Get, Post, Body, UseGuards, Put, Param, Req } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { AuthGuard, TokenDataModel } from '../utility/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put()
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @Req() request: Request<CreateBoardDto> & TokenDataModel,
  ) {
    try {
      const createdBoard = await this.boardService.create(
        createBoardDto,
        request.user.sub,
      );
      return { message: 'Board created successfully', board: createdBoard };
    } catch (error) {
      return error;
    }
  }


  // @Post()
  // create(@Body() createBoardDto: CreateBoardDto) {
  //   return this.boardService.create(createBoardDto);
  // }

  // @Get()
  // findAll() {
  //   return this.boardService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.boardService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
  //   return this.boardService.update(+id, updateBoardDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.boardService.remove(+id);
  // }
}
