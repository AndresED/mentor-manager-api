import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ILoginUseCase, LoginResponse } from './ports/login.use-case.interface';
import { LoginDto } from '../../../presentation/dtos/login.dto';
import { IUserRepositoryDomain } from '../../../../users/domain/repositories/user.repository.domain';
import { ITokenRepositoryDomain } from '../../../domain/repositories/token.repository.domain';
import { TokenEntity } from '../../../domain/entities/token.entity';
import { PasswordUtils } from '../../../../../shared/utils/password.utils';
import { IJwtServiceDomain } from '../../../domain/services/jwt.service.domain';
import { TimeUtils } from '../../../../../shared/utils/time.utils';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class LoginUseCase implements ILoginUseCase {
  constructor(
    private readonly userRepository: IUserRepositoryDomain,
    private readonly tokenRepository: ITokenRepositoryDomain,
    private readonly jwtService: IJwtServiceDomain,
  ) {}

  async execute(credentials: LoginDto): Promise<LoginResponse> {
    try {
      const user = await this.userRepository.findByEmail(credentials.email);
      if (!user) {
        throw new HttpException(
          { message: 'Invalid credentials' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isPasswordValid = await PasswordUtils.compare(
        credentials.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new HttpException(
          { message: 'Invalid credentials' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const accessToken = await this.jwtService.generateToken({
        sub: user._id,
        email: user.email,
        type: 'access',
      });

      const refreshToken = await this.jwtService.generateToken({
        sub: user._id,
        email: user.email,
        type: 'refresh',
      });

      // Save access token
      const accessTokenEntity = new TokenEntity({
        userId: user._id,
        token: accessToken,
        type: 'access',
        expiresAt: new Date(
          Date.now() +
            TimeUtils.parseDuration(process.env.JWT_EXPIRATION || '1h'),
        ),
      });

      // Save refresh token
      const refreshTokenEntity = new TokenEntity({
        userId: user._id,
        token: refreshToken,
        type: 'refresh',
        expiresAt: new Date(
          Date.now() +
            TimeUtils.parseDuration(process.env.JWT_REFRESH_EXPIRATION || '7d'),
        ),
      });

      await this.tokenRepository.save(accessTokenEntity);
      await this.tokenRepository.save(refreshTokenEntity);

      return {
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
