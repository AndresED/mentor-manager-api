import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { IRequestPasswordResetUseCase } from './ports/request-password-reset.use-case.interface';
import { IUserRepositoryDomain } from '../../../../users/domain/repositories/user.repository.domain';
import { ITokenRepositoryDomain } from '../../../domain/repositories/token.repository.domain';
import { TokenEntity } from '../../../domain/entities/token.entity';
import { IJwtServiceDomain } from '../../../domain/services/jwt.service.domain';

@Injectable()
export class RequestPasswordResetUseCase
  implements IRequestPasswordResetUseCase
{
  constructor(
    private readonly userRepository: IUserRepositoryDomain,
    private readonly tokenRepository: ITokenRepositoryDomain,
    private readonly jwtService: IJwtServiceDomain,
  ) {}

  async execute(request: { email: string }): Promise<void> {
    try {
      const user = await this.userRepository.findByEmail(request.email);
      if (!user) {
        throw new HttpException(
          { message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      // Eliminar tokens de reset anteriores
      await this.tokenRepository.deleteByUserId(user._id);

      const resetToken = await this.jwtService.generateToken({
        sub: user._id,
        email: user.email,
        type: 'password-reset',
      });

      // Guardar el token de reset
      const tokenEntity = new TokenEntity({
        userId: user._id,
        token: resetToken,
        type: 'reset',
        expiresAt: new Date(Date.now() + 3600000), // 1 hora
      });

      await this.tokenRepository.save(tokenEntity);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }
}
