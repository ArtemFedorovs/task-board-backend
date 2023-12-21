import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  UseGuards,
  ConflictException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard, TokenDataModel } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('/create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.usersService.create(createUserDto);
      return { message: 'User created successfully', user: createdUser };
    } catch (error) {
      throw new ConflictException('User already exists');
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
}
