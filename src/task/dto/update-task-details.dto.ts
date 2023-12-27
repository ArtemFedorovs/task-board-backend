import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../constants';
import {
  IsString,
  MaxLength,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';

export class UpdateTaskDetailsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: 'Title is too long. Max length is 100 characters.',
  })
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: 'Description is too long. Max length is 9999 characters.',
  })
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiProperty()
  assignedTo: number;

  @IsOptional()
  @IsEnum(Status)
  @ApiProperty()
  status: Status;
}
