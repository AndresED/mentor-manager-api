import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { IUpdateUserUseCase } from './ports/update-user.use-case.interface';
import { IUserRepositoryDomain } from '../../../domain/repositories/user.repository.domain';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UpdateUserDto } from '../../../presentation/dtos/update-user.dto';

@Injectable()
export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepositoryDomain) {}

  async execute(id: string, updateData: UpdateUserDto): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new HttpException(
          { message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      if (updateData.email) {
        const existingUser = await this.userRepository.findByEmail(
          updateData.email,
        );
        if (existingUser && existingUser._id !== id) {
          throw new HttpException(
            { message: 'Email already in use' },
            HttpStatus.CONFLICT,
          );
        }
      }

      const updatedUser = await this.userRepository.update(id, updateData);
      if (!updatedUser) {
        throw new HttpException(
          { message: 'Failed to update user' },
          HttpStatus.BAD_REQUEST,
        );
      }
      return updatedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
