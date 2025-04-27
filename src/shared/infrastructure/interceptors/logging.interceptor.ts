import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();
    const parentType = context.getArgs()[0].route?.path || 'unknown';
    const fieldName = context.getArgs()[0].route?.stack[0]?.method || 'unknown';

    return next.handle().pipe(
      tap(() => {
        Logger.debug(
          `⛩ ${method} ${url} (${fieldName}) » ${parentType} - ${Date.now() - now}ms`,
          'RESTful',
        );
      }),
      catchError((error) => {
        Logger.error(
          `⛩ ${method} ${url} (${fieldName}) » ${parentType} - Failed after ${Date.now() - now}ms`,
          error.stack,
          'RESTful',
        );
        throw error;
      }),
    );
  }
}
