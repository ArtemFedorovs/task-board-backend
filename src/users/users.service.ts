import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Task } from '../task/entities/task.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MailerService } from '../core/mailer.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async generateAccessTokens(userId: number) {
    return Promise.all([
      this.jwtService.signAsync(
        { type: 'access_token', sub: userId },
        { expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { type: 'refresh_token', sub: userId },
        { expiresIn: '30d' },
      ),
    ]).catch(() => {
      throw new InternalServerErrorException('internal server error');
    });
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOneBy({
      user_email: createUserDto.email,
    });
    if (user) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const verification_token = await bcrypt.hash(createUserDto.email, 10);
    const userData = this.userRepository.create({
      user_email: createUserDto.email,
      name: createUserDto.name,
      surname: createUserDto.surname,
      password: passwordHash,
      verification_token: verification_token,
    });

    const newUser = await this.userRepository.save(userData);
    await this.mailerService.sendVerificationMail(
      createUserDto.email,
      encodeURIComponent(verification_token),
    );
    return newUser;
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOneBy({
      verification_token: decodeURIComponent(token),
    });
    if (user) {
      user.is_email_verified = true;
      await this.userRepository.save(user);
    } else {
      throw new NotFoundException('User or task not found');
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOneBy({
      user_email: loginUserDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('Wrong login or password');
    }

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Wrong login or password');
    }

    const [accessToken, refreshToken] = await this.generateAccessTokens(
      user.id,
    );

    return {
      isLoginSuccessfull: true,
      access_token: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_SECRET_STRING,
    });
    if (!payload) {
      throw new UnauthorizedException('Wrong login or password');
    }

    const [newAccessToken, newRefreshToken] = await this.generateAccessTokens(
      payload.sub,
    );
    return {
      isLoginSuccessfull: true,
      access_token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async resetPasswordRequest(email: string, newPassword: string) {
    const resetPasswordToken = await this.jwtService.signAsync(
      {
        type: 'reset_password_token',
        sub: { email: email, newPassword: newPassword },
      },
      { expiresIn: '1d' },
    );
    await this.mailerService.sendResetPasswordMail(
      email,
      encodeURIComponent(resetPasswordToken),
    );
    return {
      isResetPasswordEmailSend: true,
    };
  }

  async resetPassword(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(
        decodeURIComponent(token),
        { secret: process.env.JWT_SECRET_STRING },
      );
      const user = await this.userRepository.findOneBy({
        user_email: payload.sub.email,
      });
      user.password = await bcrypt.hash(payload.sub.newPassword, 10);
      await this.userRepository.save(user);
    } catch {
      throw new UnauthorizedException('Password was not reseted');
    }
  }

  async getUserProfile(id: number) {
    const user = await this.userRepository.findOneBy({
      id: id,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      name: user.name,
      surname: user.surname,
    };
  }

  async updateUserProfile(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({
      id: id,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.name = updateUserDto.name;
    user.surname = updateUserDto.surname;
    await this.userRepository.save(user);
  }

  async subscribeToTaskStatusChanges(userId: number, taskId: number) {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
      },
      relations: {
        followers: true,
      },
    });
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!task || !user) {
      throw new NotFoundException('User or task not found');
    }

    const subscription = task.followers?.find(
      (follower) => follower.id === userId,
    );
    if (subscription) {
      throw new ConflictException('Subscription already exists');
    }

    task.followers.push(user);
    await this.taskRepository.save(task);
  }

  async unSubscribeToTaskStatusChanges(userId: number, taskId: number) {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
      },
      relations: {
        followers: true,
      },
    });
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!task || !user) {
      throw new NotFoundException('User or task not found');
    }

    const subscriptionIndex = task.followers?.findIndex(
      (follower) => follower.id === userId,
    );
    if (subscriptionIndex === -1) {
      throw new NotFoundException('Subscription not found');
    }

    task.followers.splice(subscriptionIndex, 1);
    await this.taskRepository.save(task);
  }
}
