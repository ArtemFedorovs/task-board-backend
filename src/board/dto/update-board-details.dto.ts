import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional } from 'class-validator';

export class UpdateBoardDetailsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: 'Title is too long. Max length is 100 characters.',
  })
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;
}
