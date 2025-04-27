import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IGetUsersUseCase } from './ports/get-users.use-case.interface';
import { IUserRepositoryDomain } from '../../../domain/repositories/user.repository.domain';
import { UserEntity } from '../../../domain/entities/user.entity';

@Injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
  constructor(private readonly userRepository: IUserRepositoryDomain) {}

  async execute(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
