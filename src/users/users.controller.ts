import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Param,
  Req,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-user.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request-dto';
import { AuthGuard, ProtectedRequest } from '../core/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.create(createUserDto);
    return { message: 'User registered successfully', user: createdUser };
  }

  @Get('/verification/:token')
  async verifyEmail(@Param('token') token: string) {
    await this.usersService.verifyEmail(token);
    return { message: 'Email verified successfully' };
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.usersService.login(loginUserDto);
  }

  @Post('/refresh-token')
  @HttpCode(200)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.usersService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('/reset-password/request')
  @HttpCode(200)
  async resetPasswordRequest(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    await this.usersService.resetPasswordRequest(
      resetPasswordRequestDto.email,
      resetPasswordRequestDto.newPassword,
    );
    return { message: 'Password reset email sent successfully' };
  }

  @Get('/reset-password/:token')
  async resetPassword(@Param('token') token: string) {
    await this.usersService.resetPassword(token);
    return { message: 'Password reset successfully' };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/profile')
  async getUserProfile(@Req() req: ProtectedRequest) {
    const userProfile = await this.usersService.getUserProfile(
      req.headers.userId,
    );
    return userProfile;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('/profile')
  async updateUserProfile(
    @Req() req: ProtectedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUserProfile(
      req.headers.userId,
      updateUserDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/subscribe/:taskId')
  @HttpCode(200)
  async subscribeToTaskStatusChanges(
    @Req() req: ProtectedRequest,
    @Param('taskId') taskId: string,
  ) {
    await this.usersService.subscribeToTaskStatusChanges(
      req.headers.userId,
      +taskId,
    );
    return { message: 'Successfully subscribed' };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/unsubscribe/:taskId')
  @HttpCode(200)
  async unSubscribeToTaskStatusChanges(
    @Req() req: ProtectedRequest,
    @Param('taskId') taskId: string,
  ) {
    await this.usersService.unSubscribeToTaskStatusChanges(
      req.headers.userId,
      +taskId,
    );
    return { message: 'Successfully unsubscribed' };
  }
}
