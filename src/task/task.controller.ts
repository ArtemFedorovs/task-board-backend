import {
  Controller,
  Put,
  Get,
  Param,
  Post,
  Body,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDetailsDto } from './dto/update-task-details.dto';
import { AssingTaskForUserDto } from './dto/assing-task-for-user.dto';
import { AuthGuard, ProtectedRequest } from '../core/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/boards/:boardId/tasks')
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: ProtectedRequest,
    @Param('boardId') boardId: string,
  ) {
    await this.taskService.create(
      boardId,
      createTaskDto,
      +req.headers['user-id'],
    );
    return { message: 'Task created successfully' };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/boards/:boardId/tasks/:taskId')
  async getTaskById(@Param('taskId') taskId: string) {
    return await this.taskService.getTaskById(taskId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/boards/:boardId/tasks')
  async getTasks(@Param('boardId') boardId: string) {
    return await this.taskService.getTasksByBoardId(boardId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('/boards/:boardId/tasks/:taskId')
  async deleteTaskById(@Param('taskId') taskId: string) {
    await this.taskService.deleteTaskById(taskId);
    return { message: 'Task deleted successfully' };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('/boards/:boardId/tasks/:taskId/status')
  async updateTaskStatus(
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Param('taskId') taskId: string,
  ) {
    await this.taskService.updateTaskStatus(updateTaskStatusDto, +taskId);
    return { message: 'Task status updated successfully' };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('/boards/:boardId/tasks/:taskId')
  async updateTaskDetails(
    @Body() updateTaskDetailsDto: UpdateTaskDetailsDto,
    @Param('taskId') taskId: string,
  ) {
    await this.taskService.updateTaskDetails(updateTaskDetailsDto, +taskId);
    return { message: 'Task updated successfully' };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('/boards/:boardId/tasks/:taskId/assign')
  async assingTaskForUser(
    @Body() assingTaskForUserDto: AssingTaskForUserDto,
    @Param('taskId') taskId: string,
  ) {
    await this.taskService.assingTaskForUser(
      +taskId,
      +assingTaskForUserDto.assignedTo,
    );
    return { message: 'Task updated successfully' };
  }
}
