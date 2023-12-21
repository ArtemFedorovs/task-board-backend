import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Task } from '../task/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      user_email: createUserDto.email,
      name: createUserDto.name,
      surname: createUserDto.surname,
      password: createUserDto.password,
    });

    return await this.userRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto) {
    // To do: hash password in DB
    const user = await this.userRepository.findOneBy({
      user_email: loginUserDto.email,
    });
    if (user.password === loginUserDto.password) {
      const access_token = await this.jwtService.signAsync({ sub: user.id });
      return { isLoginSuccessfull: true, token: access_token };
    } else {
      return { isLoginSuccessfull: false };
    }
  }

  async getUserProfile(id: number) {
    const user = await this.userRepository.findOneBy({
      id: id,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    } else {
      return {
        name: user.name,
        surname: user.surname,
      };
    }
  }

  async updateUserProfile(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({
      id: id,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.surname) {
      user.surname = updateUserDto.surname;
    }
    const newUserData = await this.userRepository.save(user);
    return {
      name: newUserData.name,
      surname: newUserData.surname,
    };
  }

  async subscribeToTaskStatusChanges(userId: number, taskId: number) {
    const task = await this.taskRepository.findOneBy({
      id: taskId,
    });
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!task || !user) {
      throw new NotFoundException('User or task not found');
    }
    const subscription = user.tracked_tasks.find((task) => task.id === taskId);
    if (subscription) {
      throw new ConflictException('Subscription already exists');
    } else {
      user.tracked_tasks.push(task);
      await this.userRepository.save(user);
    }
  }

  // async unSubscribeToTaskStatusChanges() {

  // }
}
