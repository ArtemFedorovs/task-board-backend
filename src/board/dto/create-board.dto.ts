import { ApiProperty } from '@nestjs/swagger';
// import { Status } from '../constants';

export class CreateBoardDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
