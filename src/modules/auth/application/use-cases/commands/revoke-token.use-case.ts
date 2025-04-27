import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { IRevokeTokenUseCase } from './ports/revoke-token.use-case.interface';
import { ITokenRepositoryDomain } from '../../../domain/repositories/token.repository.domain';

@Injectable()
export class RevokeTokenUseCase implements IRevokeTokenUseCase {
  constructor(private readonly tokenRepository: ITokenRepositoryDomain) {}

  async execute(token: string): Promise<void> {
    try {
      const storedToken = await this.tokenRepository.findByToken(token);

      if (!storedToken) {
        throw new HttpException(
          { message: 'Token not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      await this.tokenRepository.deleteByToken(token);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
