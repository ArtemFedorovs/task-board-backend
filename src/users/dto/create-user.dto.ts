import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, {
    message: 'Name is too long. Max length is 50 characters.',
  })
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, {
    message: 'Surname is too long. Max length is 50 characters.',
  })
  @ApiProperty()
  surname: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
