import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { ChangeTaskStatusDto } from './dto/change-task-status.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Board } from '../board/entities/board.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Status } from './constants';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto, creatorId: number) {
    const board = await this.boardRepository.findOneBy({
      id: createTaskDto.boardId,
    });
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const creator = await this.userRepository.findOneBy({
      id: creatorId,
    });

    const newTask = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: Status.BACKLOG,
      expired_at: createTaskDto.expired_at,
      board: board,
      creator: creator,
    });
    return await this.taskRepository.save(newTask);
  }

  async changeTaskStatus(
    changeTaskStatusDto: ChangeTaskStatusDto,
    taskId: number,
  ) {
    const task = await this.taskRepository.findOneBy({
      id: taskId,
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    task.status = changeTaskStatusDto.status;
    return await this.taskRepository.save(task);
  }

  // findAll() {
  //   return `This action returns all task`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} task`;
  // }

  // update(id: number, updateTaskDto: UpdateTaskDto) {
  //   return `This action updates a #${id} task`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} task`;
  // }
}
