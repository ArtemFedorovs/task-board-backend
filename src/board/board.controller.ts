import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Put,
  Delete,
  Param,
  HttpCode,
  Req,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { UpdateBoardDetailsDto } from './dto/update-board-details.dto';
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
    await this.boardService.create(createBoardDto, +req.headers['user-id']);
    return { message: 'Board created successfully' };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/boards')
  async getAllBoards() {
    return await this.boardService.getAllBoards();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/boards/:boardId')
  async getBoardById(@Param('boardId') boardId: string) {
    return await this.boardService.getBoardById(+boardId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('/boards/:boardId')
  async deleteBoardById(@Param('boardId') boardId: string) {
    await this.boardService.deleteBoardById(+boardId);
    return { message: 'Board deleted successfully' };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('/boards/:boardId')
  async updateBoardDetails(
    @Body() updateBoardDetailsDto: UpdateBoardDetailsDto,
    @Param('boardId') boardId: string,
  ) {
    await this.boardService.updateBoardDetails(updateBoardDetailsDto, +boardId);
    return { message: 'Board updated successfully' };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/boards/:boardId/invite')
  @HttpCode(200)
  async inviteUser(
    @Body() inviteUserDto: InviteUserDto,
    @Param('boardId') boardId: string,
  ) {
    await this.boardService.inviteUser(+boardId, inviteUserDto.userId);
    return { message: 'User invited to the board' };
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/boards/:boardId/remove-user')
  @HttpCode(200)
  async removeUser(
    @Body() inviteUserDto: InviteUserDto,
    @Param('boardId') boardId: string,
  ) {
    await this.boardService.removeUser(+boardId, inviteUserDto.userId);
    return { message: 'User removed from the board' };
  }
}
