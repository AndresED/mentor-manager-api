import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ICreateUserUseCase } from './ports/create-user.use-case.interface';
import { IUserRepositoryDomain } from '../../../domain/repositories/user.repository.domain';
import { UserEntity } from '../../../domain/entities/user.entity';
import { PasswordUtils } from '../../../../../shared/utils/password.utils';

@Injectable()
export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(private readonly userRepository: IUserRepositoryDomain) {}

  async execute(
    email: string,
    name: string,
    password: string,
  ): Promise<UserEntity> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new HttpException(
          { message: 'User already exists' },
          HttpStatus.CONFLICT,
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const hashedPassword = await PasswordUtils.hash(password);

      return await this.userRepository.save(
        new UserEntity({
          email,
          name,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          password: hashedPassword,
        }),
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new InternalServerErrorException(error.message);
    }
  }
}
