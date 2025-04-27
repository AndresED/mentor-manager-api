import { Test } from '@nestjs/testing';
import { GetUsersUseCase } from '../../../application/use-cases/queries/get-users.use-case';
import { IUserRepositoryDomain } from '../../../domain/repositories/user.repository.domain';
import { mockUserRepository } from '../../mocks/user.repository.mock';
import { mockUserEntityList } from '../../mocks/user.entity.mock';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

describe('GetUsersUseCase', () => {
  let getUsersUseCase: GetUsersUseCase;
  let userRepository: jest.Mocked<IUserRepositoryDomain>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetUsersUseCase,
        {
          provide: IUserRepositoryDomain,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    getUsersUseCase = moduleRef.get<GetUsersUseCase>(GetUsersUseCase);
    userRepository = moduleRef.get(IUserRepositoryDomain);
    jest.clearAllMocks();
  });

  it('should return all users successfully', async () => {
    userRepository.findAll.mockResolvedValueOnce(mockUserEntityList);

    const result = await getUsersUseCase.execute();

    expect(result).toEqual(mockUserEntityList);
    expect(userRepository.findAll).toHaveBeenCalled();
  });

  it('should return empty array when no users exist', async () => {
    userRepository.findAll.mockResolvedValueOnce([]);

    const result = await getUsersUseCase.execute();

    expect(result).toEqual([]);
    expect(userRepository.findAll).toHaveBeenCalled();
  });

  it('should throw InternalServerErrorException on unexpected error', async () => {
    userRepository.findAll.mockRejectedValueOnce(new Error('Database error'));

    await expect(getUsersUseCase.execute()).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should propagate HttpException', async () => {
    const httpError = new HttpException('Custom error', HttpStatus.BAD_REQUEST);
    userRepository.findAll.mockRejectedValueOnce(httpError);

    await expect(getUsersUseCase.execute()).rejects.toThrow(httpError);
    expect(userRepository.findAll).toHaveBeenCalled();
  });
});
