import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class InviteUserDto {
  @IsInt()
  @Min(0)
  @ApiProperty()
  userId: number;
}
