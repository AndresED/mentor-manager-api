import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RevokeTokenDto {
  @ApiProperty()
  @IsString()
  token: string;
}
