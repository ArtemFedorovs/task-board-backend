import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-user.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request-dto';
import { AuthGuard, TokenDataModel } from '../utility/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.usersService.create(createUserDto);
      return { message: 'User created successfully', user: createdUser };
    } catch (error) {
      return error;
    }
  }

  @Get('/verification/:token')
  async verifyEmail(@Param('token') token: string) {
    console.log(1)
    try {
      await this.usersService.verifyEmail(token);
      return 'Successfully verified';
    } catch (error) {
      return error;
    }
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const response = await this.usersService.login(loginUserDto);
      return response;
    } catch (error) {
      return error;
    }
  }

  @Post('/refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const response = await this.usersService.refreshToken(
        refreshTokenDto.refreshToken,
      );
      return response;
    } catch (error) {
      return error;
    }
  }

  @Post('/reset-password/request')
  async resetPasswordRequest(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    try {
      const response = await this.usersService.resetPasswordRequest(
        resetPasswordRequestDto.email,
        resetPasswordRequestDto.newPassword,
      );
      return response;
    } catch (error) {
      return error;
    }
  }

  @Get('/reset-password/:token')
  async resetPassword(@Param('token') token: string) {
    try {
      const response = await this.usersService.resetPassword(token);
      return response;
    } catch (error) {
      return error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/profile')
  async getUserProfile(@Req() request: TokenDataModel) {
    try {
      const userProfile = await this.usersService.getUserProfile(
        request.user.sub,
      );
      return userProfile;
    } catch (error) {
      return error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/profile')
  async updateUserProfile(
    @Req() request: Request<UpdateUserDto> & TokenDataModel,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updateUser = await this.usersService.updateUserProfile(
        request.user.sub,
        updateUserDto,
      );
      return updateUser;
    } catch (error) {
      return error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/subscribe/:taskId')
  async subscribeToTaskStatusChanges(
    @Req() request: Request<UpdateUserDto> & TokenDataModel,
    @Param('taskId') taskId: string,
  ) {
    try {
      await this.usersService.subscribeToTaskStatusChanges(
        request.user.sub,
        +taskId,
      );
      return { message: 'Successfully subscribed' };
    } catch (error) {
      return error;
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/unsubscribe/:taskId')
  async unSubscribeToTaskStatusChanges(
    @Req() request: Request<UpdateUserDto> & TokenDataModel,
    @Param('taskId') taskId: string,
  ) {
    try {
      await this.usersService.unSubscribeToTaskStatusChanges(
        request.user.sub,
        +taskId,
      );
      return { message: 'Successfully unsubscribed' };
    } catch (error) {
      return error;
    }
  }
}
