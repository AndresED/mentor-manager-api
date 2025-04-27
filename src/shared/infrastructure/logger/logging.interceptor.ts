import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logger Interceptor.
 * Creates informative loggs to all requests, showing the path and
 * the method name.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgs()[0] as {
      route: { path: string; stack: [{ method: string }] };
    };
    const parentType = req.route.path;
    const fieldName = req.route.stack[0].method;
    return next.handle().pipe(
      tap(() => {
        Logger.debug(`⛩  ${parentType} » ${fieldName}`, 'RESTful');
      }),
    );
  }
}
