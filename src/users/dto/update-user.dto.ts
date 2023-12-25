import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50, {
    message: 'Name is too long. Max length is 50 characters.',
  })
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, {
    message: 'Surname is too long. Max length is 50 characters.',
  })
  @ApiProperty()
  surname: string;
}
