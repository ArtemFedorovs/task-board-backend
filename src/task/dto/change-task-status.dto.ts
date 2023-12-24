import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../constants';

export class ChangeTaskStatusDto {
  @ApiProperty()
  status: Status;
}
