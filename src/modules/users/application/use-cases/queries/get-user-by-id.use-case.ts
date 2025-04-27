import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { IGetUserByIdUseCase } from './ports/get-user-by-id.use-case.interface';
import { IUserRepositoryDomain } from '../../../domain/repositories/user.repository.domain';
import { UserEntity } from '../../../domain/entities/user.entity';

@Injectable()
export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepositoryDomain) {}

  async execute(id: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new HttpException(
          { message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
