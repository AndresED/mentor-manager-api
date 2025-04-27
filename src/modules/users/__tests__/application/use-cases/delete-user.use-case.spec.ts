import { Test } from '@nestjs/testing';
import { DeleteUserUseCase } from '../../../application/use-cases/commands/delete-user.use-case';
import { IUserRepositoryDomain } from '../../../domain/repositories/user.repository.domain';
import { mockUserRepository } from '../../mocks/user.repository.mock';
import { mockUserEntity } from '../../mocks/user.entity.mock';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let userRepository: jest.Mocked<IUserRepositoryDomain>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: IUserRepositoryDomain,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    deleteUserUseCase = moduleRef.get<DeleteUserUseCase>(DeleteUserUseCase);
    userRepository = moduleRef.get(IUserRepositoryDomain);
    jest.clearAllMocks();
  });

  it('should delete a user successfully', async () => {
    const userId = '65123456789abcdef1234567';

    userRepository.findById.mockResolvedValueOnce(mockUserEntity);
    userRepository.delete.mockResolvedValueOnce(undefined);

    await deleteUserUseCase.execute(userId);

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.delete).toHaveBeenCalledWith(userId);
  });

  it('should throw an error if user does not exist', async () => {
    const userId = 'nonexistent-id';

    userRepository.findById.mockResolvedValueOnce(null);

    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(
      new HttpException('User not found', HttpStatus.NOT_FOUND),
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw InternalServerErrorException on unexpected error', async () => {
    const userId = '65123456789abcdef1234567';

    userRepository.findById.mockRejectedValueOnce(new Error('Database error'));

    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.delete).not.toHaveBeenCalled();
  });

  it('should propagate HttpException', async () => {
    const userId = '65123456789abcdef1234567';
    const httpError = new HttpException('Custom error', HttpStatus.BAD_REQUEST);

    userRepository.findById.mockRejectedValueOnce(httpError);

    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(httpError);

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw bad request error if delete fails', async () => {
    const userId = '65123456789abcdef1234567';

    userRepository.findById.mockResolvedValueOnce(mockUserEntity);
    userRepository.delete.mockRejectedValueOnce(
      new Error('Failed to delete user'),
    );

    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(
      new HttpException('Failed to delete user', HttpStatus.BAD_REQUEST),
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.delete).toHaveBeenCalledWith(userId);
  });
});
