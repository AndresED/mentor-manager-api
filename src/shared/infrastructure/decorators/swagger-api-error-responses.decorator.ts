import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {
  ResponseUnauthorizedAndRoleDto,
  ResponseBadRequestError,
  ResponseError,
  ResponseError500,
} from '../dtos/responses/api-response.dto';

export function SwaggerApiErrorResponses() {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: 'Requiere autenticación',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: ResponseUnauthorizedAndRoleDto,
    }),
    ApiResponse({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: ResponseBadRequestError,
      status: 400,
      description:
        'Errores relacionados a las validaciones de la información enviada al api',
    }),
    ApiResponse({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: ResponseError,
      status: 422,
      description: 'Errores controlados en el api.',
    }),
    ApiResponse({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: ResponseError500,
      status: 500,
      description: 'Error inesperado en el servidor',
    }),
  );
}
