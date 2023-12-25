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
import { AuthGuard, TokenDataModel } from '../utility/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/boards/:boardId/tasks')
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() request: Request<CreateTaskDto> & TokenDataModel,
    @Param('boardId') boardId: string,
  ) {
    try {
      await this.taskService.create(boardId, createTaskDto, request.user.sub);
      return { message: 'Task created successfully' };
    } catch (error) {
      return error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/boards/:boardId/tasks/:taskId')
  async getTaskById(@Param('taskId') taskId: string) {
    try {
      const task = await this.taskService.getTaskById(taskId);
      return task;
    } catch (error) {
      return error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/boards/:boardId/tasks')
  async getTasks(@Param('boardId') boardId: string) {
    try {
      const tasks = await this.taskService.getTasksByBoardId(boardId);
      return tasks;
    } catch (error) {
      return error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('/boards/:boardId/tasks/:taskId')
  async deleteTaskById(@Param('taskId') taskId: string) {
    try {
      await this.taskService.deleteTaskById(taskId);
      return { message: 'Task deleted successfully' };
    } catch (error) {
      return error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('/boards/:boardId/tasks/:taskId/status')
  async updateTaskStatus(
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Param('taskId') taskId: string,
  ) {
    try {
      await this.taskService.updateTaskStatus(updateTaskStatusDto, +taskId);
      return { message: 'Task status updated successfully' };
    } catch (error) {
      return error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('/boards/:boardId/tasks/:taskId')
  async updateTaskDetails(
    @Body() updateTaskDetailsDto: UpdateTaskDetailsDto,
    @Param('taskId') taskId: string,
  ) {
    try {
      await this.taskService.updateTaskDetails(updateTaskDetailsDto, +taskId);
      return { message: 'Task updated successfully' };
    } catch (error) {
      return error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('/boards/:boardId/tasks/:taskId/assign')
  async assingTaskForUser(
    @Body() assingTaskForUserDto: AssingTaskForUserDto,
    @Param('taskId') taskId: string,
  ) {
    try {
      await this.taskService.assingTaskForUser(
        +taskId,
        +assingTaskForUserDto.assignedTo,
      );
      return { message: 'Task updated successfully' };
    } catch (error) {
      return error;
    }
  } 
}
