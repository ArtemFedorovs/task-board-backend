import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, MaxLength, IsOptional } from 'class-validator';

export class CreateTaskDto {
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

  @IsDateString()
  @ApiProperty()
  expired_at: Date;
}
