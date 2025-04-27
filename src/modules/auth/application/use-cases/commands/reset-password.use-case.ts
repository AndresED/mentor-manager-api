import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { IResetPasswordUseCase } from './ports/reset-password.use-case.interface';
import { IUserRepositoryDomain } from '../../../../users/domain/repositories/user.repository.domain';
import { ITokenRepositoryDomain } from '../../../domain/repositories/token.repository.domain';
import { PasswordUtils } from '../../../../../shared/utils/password.utils';
import { IJwtServiceDomain } from '../../../domain/services/jwt.service.domain';

@Injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepositoryDomain,
    private readonly tokenRepository: ITokenRepositoryDomain,
    private readonly jwtService: IJwtServiceDomain,
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyToken(token);
      if (!payload || payload.type !== 'password-reset') {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      const storedToken = await this.tokenRepository.findByToken(token);
      if (!storedToken || storedToken.isExpired()) {
        throw new HttpException(
          { message: 'Token expired or invalid' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const hashedPassword = await PasswordUtils.hash(newPassword);
      await this.userRepository.update(user._id, { password: hashedPassword });

      // Eliminar el token usado
      await this.tokenRepository.deleteByToken(token);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
