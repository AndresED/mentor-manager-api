import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { IJwtServiceDomain } from '../../domain/services/jwt.service.domain';
import { ITokenRepositoryDomain } from '../../domain/repositories/token.repository.domain';

@Injectable()
export class TokenRevocationGuard implements CanActivate {
  constructor(
    private readonly jwtService: IJwtServiceDomain,
    private readonly tokenRepository: ITokenRepositoryDomain,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify JWT token
      const payload = await this.jwtService.verifyToken(token);
      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      // Check if token exists in database and is not expired
      const storedToken = await this.tokenRepository.findByToken(token);
      if (!storedToken) {
        throw new HttpException(
          { message: 'Token has been revoked' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (storedToken.isExpired()) {
        throw new HttpException(
          { message: 'Token has expired' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Add user payload to request
      request.user = payload;
      return true;
    } catch (error) {
      throw new HttpException(
        { message: 'Invalid token' },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
