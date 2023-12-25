import {
  Controller,
  Put,
  Inject,
  Param,
  Post,
  Body,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { ChangeTaskStatusDto } from './dto/change-task-status.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard, TokenDataModel } from '../utility/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put()
  async createTask(
    @Body() createUserDto: CreateTaskDto,
    @Req() request: Request<CreateTaskDto> & TokenDataModel,
  ) {
    try {
      const createdTask = await this.taskService.create(
        createUserDto,
        request.user.sub,
      );
      return { message: 'Task created successfully', task: createdTask };
    } catch (error) {
      return error;
    }
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  // @Post('tasks/:taskId/assign')
  // async changeTaskStatus(
  //   @Body() changeTaskStatusDto: ChangeTaskStatusDto,
  //   @Param('taskId') taskId: string,
  // ) {} 

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/:taskId/status')
  async changeTaskStatus(
    @Body() changeTaskStatusDto: ChangeTaskStatusDto,
    @Param('taskId') taskId: string,
  ) {
    try {
      const createdTask = await this.taskService.changeTaskStatus(
        changeTaskStatusDto,
        +taskId,
      );
      return { message: 'Task status changed successfully', task: createdTask };
    } catch (error) {
      return error;
    }
  }
  // @Post()
  // create(@Body() createTaskDto: CreateTaskDto) {
  //   return this.taskService.create(createTaskDto);
  // }

  // @Get()
  // findAll() {
  //   return this.taskService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.taskService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
  //   return this.taskService.update(+id, updateTaskDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.taskService.remove(+id);
  // }
}
