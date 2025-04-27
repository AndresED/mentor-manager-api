import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { IRefreshTokenUseCase } from './ports/refresh-token.use-case.interface';
import { ITokenRepositoryDomain } from '../../../domain/repositories/token.repository.domain';
import { IJwtServiceDomain } from '../../../domain/services/jwt.service.domain';
import { TokenEntity } from '../../../domain/entities/token.entity';
import * as dotenv from 'dotenv';
import { TimeUtils } from '../../../../../shared/utils/time.utils';
dotenv.config();
@Injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private readonly tokenRepository: ITokenRepositoryDomain,
    private readonly jwtService: IJwtServiceDomain,
  ) {}

  async execute(refreshToken: string) {
    try {
      const storedToken = await this.tokenRepository.findByToken(refreshToken);

      if (
        !storedToken ||
        storedToken.type !== 'refresh' ||
        storedToken.isExpired()
      ) {
        throw new HttpException(
          { message: 'Invalid or expired refresh token' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const payload = await this.jwtService.verifyToken(refreshToken);
      if (!payload) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      // Generate new tokens
      const newAccessToken = await this.jwtService.generateToken({
        sub: payload.sub,
        email: payload.email,
        type: 'access',
      });

      const newRefreshToken = await this.jwtService.generateToken({
        sub: payload.sub,
        email: payload.email,
        type: 'refresh',
      });

      // Delete old refresh token
      await this.tokenRepository.deleteByToken(refreshToken);

      // Save new refresh token
      const tokenEntity = new TokenEntity({
        userId: payload.sub,
        token: newRefreshToken,
        type: 'refresh',
        expiresAt: new Date(
          Date.now() +
            TimeUtils.parseDuration(process.env.JWT_REFRESH_EXPIRATION || '7d'),
        ),
      });
      await this.tokenRepository.save(tokenEntity);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
