import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/require-await
  async catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const exep = exception;
    const responseError: any = exep.getResponse();
    const requestId: any = response.getHeader('X-Request-ID');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    response.header('X-Request-ID', requestId).status(status).json({
      success: false,
      code: status,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      message: responseError.message,
      data: null,
    });
  }
}
