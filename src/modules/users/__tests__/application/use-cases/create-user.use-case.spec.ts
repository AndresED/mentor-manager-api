import { Test } from '@nestjs/testing';
import { CreateUserUseCase } from '../../../application/use-cases/commands/create-user.use-case';
import { IUserRepositoryDomain } from '../../../domain/repositories/user.repository.domain';
import { mockUserRepository } from '../../mocks/user.repository.mock';
import { mockUserEntity } from '../../mocks/user.entity.mock';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: jest.Mocked<IUserRepositoryDomain>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: IUserRepositoryDomain,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    createUserUseCase = moduleRef.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = moduleRef.get(IUserRepositoryDomain);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should create a user successfully', async () => {
    const createUserDto = {
      email: 'new@example.com',
      name: 'New User',
      password: 'password123',
    };

    userRepository.findByEmail.mockResolvedValueOnce(null);
    userRepository.save.mockResolvedValueOnce(mockUserEntity);

    const result = await createUserUseCase.execute(
      createUserDto.email,
      createUserDto.name,
      createUserDto.password,
    );

    expect(result).toEqual(mockUserEntity);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      createUserDto.email,
    );
    expect(userRepository.save).toHaveBeenCalled();
  });

  it('should throw an error if user already exists', async () => {
    const createUserDto = {
      email: 'existing@example.com',
      name: 'Existing User',
      password: 'password123',
    };

    userRepository.findByEmail.mockResolvedValueOnce(mockUserEntity);

    await expect(
      createUserUseCase.execute(
        createUserDto.email,
        createUserDto.name,
        createUserDto.password,
      ),
    ).rejects.toThrow(
      new HttpException('User already exists', HttpStatus.CONFLICT),
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      createUserDto.email,
    );
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should throw InternalServerErrorException on unexpected error', async () => {
    const createUserData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };

    userRepository.findByEmail.mockRejectedValueOnce(
      new Error('Database error'),
    );

    await expect(
      createUserUseCase.execute(
        createUserData.email,
        createUserData.name,
        createUserData.password,
      ),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should propagate HttpException', async () => {
    const createUserData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };

    const httpError = new HttpException('Custom error', HttpStatus.BAD_REQUEST);
    userRepository.findByEmail.mockRejectedValueOnce(httpError);

    await expect(
      createUserUseCase.execute(
        createUserData.email,
        createUserData.name,
        createUserData.password,
      ),
    ).rejects.toThrow(httpError);
  });
});
