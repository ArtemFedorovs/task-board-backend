import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.usersService.create(createUserDto);
      return { message: 'User created successfully', user: createdUser };
    } catch (error) {
      return {
        message: 'Failed to create user',
        error: error.message || 'Internal server error',
      }; // update errors
    }
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const jwtToken = await this.usersService.login(loginUserDto);
      return { message: 'Succsessful login', token: jwtToken };
    } catch (error) {
      return {
        message: 'Failed to login user',
        error: error.message || 'Internal server error',
      }; // remake errors
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/checkAuth')
  findAll() {
    return 'nice';
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
