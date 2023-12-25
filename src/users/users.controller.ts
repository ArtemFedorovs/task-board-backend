import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Headers,
  Param,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-user.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request-dto';
import { AuthGuard } from '../utility/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.usersService.create(createUserDto);
      return { message: 'User registered successfully', user: createdUser };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Get('/verification/:token')
  async verifyEmail(@Param('token') token: string) {
    try {
      await this.usersService.verifyEmail(token);
      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const response = await this.usersService.login(loginUserDto);
      return response;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Post('/refresh-token')
  @HttpCode(200)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const response = await this.usersService.refreshToken(
        refreshTokenDto.refreshToken,
      );
      return response;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Post('/reset-password/request')
  @HttpCode(200)
  async resetPasswordRequest(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    try {
      await this.usersService.resetPasswordRequest(
        resetPasswordRequestDto.email,
        resetPasswordRequestDto.newPassword,
      );
      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @Get('/reset-password/:token')
  async resetPassword(@Param('token') token: string) {
    try {
      await this.usersService.resetPassword(token);
      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/profile')
  async getUserProfile(@Headers('userId') userId: string) {
    try {
      const userProfile = await this.usersService.getUserProfile(+userId);
      return userProfile;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('/profile')
  async updateUserProfile(
    @Headers('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updateUser = await this.usersService.updateUserProfile(
        +userId,
        updateUserDto,
      );
      return updateUser;
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/subscribe/:taskId')
  @HttpCode(200)
  async subscribeToTaskStatusChanges(
    @Headers('userId') userId: string,
    @Param('taskId') taskId: string,
  ) {
    try {
      await this.usersService.subscribeToTaskStatusChanges(+userId, +taskId);
      return { message: 'Successfully subscribed' };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/unsubscribe/:taskId')
  @HttpCode(200)
  async unSubscribeToTaskStatusChanges(
    @Headers('userId') userId: string,
    @Param('taskId') taskId: string,
  ) {
    try {
      await this.usersService.unSubscribeToTaskStatusChanges(+userId, +taskId);
      return { message: 'Successfully unsubscribed' };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  }
}
