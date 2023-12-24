import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequestDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  newPassword: string;
}
