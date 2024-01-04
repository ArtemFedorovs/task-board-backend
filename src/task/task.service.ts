import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDetailsDto } from './dto/update-task-details.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Board } from '../board/entities/board.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Status } from './constants';
import { NotificationGateway } from '../notification/notification.gateway';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(NotificationGateway)
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async create(boardId, createTaskDto: CreateTaskDto, creatorId: number) {
    const board = await this.boardRepository.findOneBy({
      id: boardId,
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

  async getTasksByBoardId(boardId: string) {
    const board = await this.boardRepository.findOne({
      where: {
        id: +boardId,
      },
    });
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const tasks = await this.taskRepository.find({
      where: {
        board: board,
      },
      relations: {
        assigned_user: true,
      },
    });
    if (!tasks) {
      throw new InternalServerErrorException();
    }

    return tasks;
  }

  async getTaskById(taskId: string) {
    const task = await this.taskRepository.findOne({
      where: {
        id: +taskId,
      },
      relations: {
        assigned_user: true,
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async deleteTaskById(taskId: string) {
    let task = await this.taskRepository.findOne({
      where: {
        id: +taskId,
      },
      relations: {
        assigned_user: true,
        followers: true,
        creator: true,
        board: true,
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.assigned_user = null;
    task.creator = null;
    task.board = null;
    task.followers = [];
    await this.taskRepository.save(task);

    task = await this.taskRepository.findOne({
      where: {
        id: +taskId,
      },
    });
    await this.taskRepository.delete(task);
  }

  async updateTaskStatus(
    updateTaskStatusDto: UpdateTaskStatusDto,
    taskId: number,
  ) {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
      },
      relations: {
        followers: true,
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    this.notificationGateway.sendMessageToClients(
      task.followers.map((user) => user.id),
      'notification',
      `Status of task "${task.title}" was changed to "${task.status}"`,
    );
    task.status = updateTaskStatusDto.status;
    return await this.taskRepository.save(task);
  }

  async updateTaskDetails(
    updateTaskDetailsDto: UpdateTaskDetailsDto,
    taskId: number,
  ) {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
      },
      relations: {
        assigned_user: true,
        followers: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.title = updateTaskDetailsDto.title;
    task.description = updateTaskDetailsDto.description;

    if (updateTaskDetailsDto.assignedTo) {
      const assigned_user = await this.userRepository.findOneBy({
        id: updateTaskDetailsDto.assignedTo,
      });
      if (!assigned_user) {
        throw new NotFoundException('User not found');
      }
      task.assigned_user = assigned_user;
    }

    if (updateTaskDetailsDto.status) {
      task.status = updateTaskDetailsDto.status;
      try {
        this.notificationGateway.sendMessageToClients(
          task.followers.map((user) => user.id),
          'notification',
          `Status of task "${task.title}" was changed to "${task.status}"`,
        );
      } catch {
        throw new InternalServerErrorException();
      }
    }

    await this.taskRepository.save(task);
  }

  async assingTaskForUser(taskId: number, assignedToUserId: number) {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
      },
      relations: {
        assigned_user: true,
      },
    });
    const user = await this.userRepository.findOne({
      where: {
        id: assignedToUserId,
      },
    });
    if (!task || !user) {
      throw new NotFoundException('User or task not found');
    }

    task.assigned_user = user;
    await this.taskRepository.save(task);
  }

  @Cron('0 */15 * * * *')
  async handleCron() {
    const currentDate = new Date();
    const fifteenMinutesFromNow = new Date(currentDate.getTime() + 15 * 60000);
    const tasks = await this.taskRepository
      .createQueryBuilder('user')
      .where('user.expired_at >= :currentDate', { currentDate })
      .andWhere('user.expired_at <= :fifteenMinutesFromNow', {
        fifteenMinutesFromNow,
      })
      .getMany();
    for (const task of tasks) {
      this.updateTaskStatus({ status: Status.CLOSED }, task.id);
    }
  }
}
