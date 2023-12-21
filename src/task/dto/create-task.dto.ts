import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  expired_at: Date;

  @ApiProperty()
  boardId: number;
}
