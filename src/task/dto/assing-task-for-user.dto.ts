import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AssingTaskForUserDto {
  @IsInt()
  @Min(0)
  @ApiProperty()
  assignedTo: number;
}
