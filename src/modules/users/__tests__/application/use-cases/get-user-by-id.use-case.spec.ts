import { Test } from '@nestjs/testing';
import { GetUserByIdUseCase } from '../../../application/use-cases/queries/get-user-by-id.use-case';
import { IUserRepositoryDomain } from '../../../domain/repositories/user.repository.domain';
import { mockUserRepository } from '../../mocks/user.repository.mock';
import { mockUserEntity } from '../../mocks/user.entity.mock';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

describe('GetUserByIdUseCase', () => {
  let getUserByIdUseCase: GetUserByIdUseCase;
  let userRepository: jest.Mocked<IUserRepositoryDomain>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetUserByIdUseCase,
        {
          provide: IUserRepositoryDomain,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    getUserByIdUseCase = moduleRef.get<GetUserByIdUseCase>(GetUserByIdUseCase);
    userRepository = moduleRef.get(IUserRepositoryDomain);
    jest.clearAllMocks();
  });

  it('should return user by id successfully', async () => {
    const userId = '65123456789abcdef1234567';
    userRepository.findById.mockResolvedValueOnce(mockUserEntity);

    const result = await getUserByIdUseCase.execute(userId);

    expect(result).toEqual(mockUserEntity);
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
  });

  it('should throw error if user does not exist', async () => {
    const userId = 'nonexistent-id';
    userRepository.findById.mockResolvedValueOnce(null);

    await expect(getUserByIdUseCase.execute(userId)).rejects.toThrow(
      new HttpException('User not found', HttpStatus.NOT_FOUND),
    );
  });

  it('should throw InternalServerErrorException on unexpected error', async () => {
    const userId = '65123456789abcdef1234567';
    userRepository.findById.mockRejectedValueOnce(new Error('Database error'));

    await expect(getUserByIdUseCase.execute(userId)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
