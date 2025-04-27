import { ApiProperty } from '@nestjs/swagger';

export class MessageError {
  @ApiProperty({
    description:
      'Error controlado que ha sido generado al momento de realizar un proceso interno en el api',
    type: String,
  })
  message: string;
}

export class MessageError500 {
  @ApiProperty({
    description: 'Error inesperado',
    default: 'Error inesperado',
    type: String,
  })
  message: string;
}

export class ResponseUnauthorizedDto {
  @ApiProperty({
    type: Boolean,
    default: true,
  })
  success: boolean;

  @ApiProperty({
    type: String,
  })
  message: string;

  @ApiProperty({
    default: 'Unauthorized',
    type: String,
  })
  data: string;
}

export class ResponseUnauthorizedAndRoleDto {
  @ApiProperty({
    type: Boolean,
    default: true,
  })
  success: boolean;

  @ApiProperty({
    type: String,
  })
  message: string;

  @ApiProperty({
    default: 'Unauthorized or Your role is wrong',
    type: String,
  })
  data: string;
}

export class ResponseError {
  @ApiProperty({
    type: Boolean,
    default: true,
  })
  success: boolean;

  @ApiProperty({
    type: String,
  })
  message: string;

  @ApiProperty({ type: MessageError })
  data: MessageError;
}

export class ResponseBadRequestError {
  @ApiProperty({
    type: Boolean,
    default: true,
  })
  success: boolean;

  @ApiProperty({
    type: String,
  })
  message: string;

  @ApiProperty({ type: [String] })
  data: string[];
}

export class ResponseError500 {
  @ApiProperty({
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    type: String,
  })
  message: string;

  @ApiProperty({ type: MessageError500 })
  data: MessageError500;
}
