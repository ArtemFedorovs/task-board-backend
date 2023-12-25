import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../constants';
import { IsEnum } from 'class-validator';
export class UpdateTaskStatusDto {
  @IsEnum(Status)
  @ApiProperty()
  status: Status;
}
