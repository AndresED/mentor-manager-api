import { Test } from '@nestjs/testing';
import { UpdateUserUseCase } from '../../../application/use-cases/commands/update-user.use-case';
import { IUserRepositoryDomain } from '../../../domain/repositories/user.repository.domain';
import { mockUserRepository } from '../../mocks/user.repository.mock';
import { mockUserEntity } from '../../mocks/user.entity.mock';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserEntity } from '../../../domain/entities/user.entity';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let userRepository: jest.Mocked<IUserRepositoryDomain>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        {
          provide: IUserRepositoryDomain,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    updateUserUseCase = moduleRef.get<UpdateUserUseCase>(UpdateUserUseCase);
    userRepository = moduleRef.get(IUserRepositoryDomain);
    jest.clearAllMocks();
  });

  it('should update a user successfully', async () => {
    const userId = '65123456789abcdef1234567';
    const updateData = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    const updatedUser = {
      ...mockUserEntity,
      name: updateData.name,
      email: updateData.email,
    } as UserEntity;

    userRepository.findById.mockResolvedValueOnce(mockUserEntity);
    userRepository.update.mockResolvedValueOnce(updatedUser);

    const result = await updateUserUseCase.execute(userId, updateData);

    expect(result).toEqual(updatedUser);
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.update).toHaveBeenCalledWith(userId, updateData);
  });

  it('should throw an error if user does not exist', async () => {
    const userId = 'nonexistent-id';
    const updateData = {
      name: 'Updated Name',
    };

    userRepository.findById.mockResolvedValueOnce(null);

    await expect(updateUserUseCase.execute(userId, updateData)).rejects.toThrow(
      new HttpException('User not found', HttpStatus.NOT_FOUND),
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('should throw conflict error if updating email to one that already exists', async () => {
    const userId = '65123456789abcdef1234567';
    const updateData = {
      email: 'existing@example.com',
    };

    userRepository.findById.mockResolvedValueOnce(mockUserEntity);
    userRepository.findByEmail.mockResolvedValueOnce({
      ...mockUserEntity,
      _id: 'different-id',
      email: updateData.email,
    } as UserEntity);

    await expect(updateUserUseCase.execute(userId, updateData)).rejects.toThrow(
      new HttpException('Email already in use', HttpStatus.CONFLICT),
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(updateData.email);
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('should throw bad request error if update fails', async () => {
    const userId = '65123456789abcdef1234567';
    const updateData = {
      name: 'Updated Name',
    };

    userRepository.findById.mockResolvedValueOnce(mockUserEntity);
    userRepository.update.mockResolvedValueOnce(null);

    await expect(updateUserUseCase.execute(userId, updateData)).rejects.toThrow(
      new HttpException('Failed to update user', HttpStatus.BAD_REQUEST),
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.update).toHaveBeenCalledWith(userId, updateData);
  });

  it('should allow update if email exists but belongs to same user', async () => {
    const userId = '65123456789abcdef1234567';
    const updateData = {
      email: 'same@example.com',
    };

    userRepository.findById.mockResolvedValueOnce(mockUserEntity);
    userRepository.findByEmail.mockResolvedValueOnce({
      ...mockUserEntity,
      _id: userId,
      email: updateData.email,
    } as UserEntity);

    const updatedUser = {
      ...mockUserEntity,
      email: updateData.email,
    } as UserEntity;

    userRepository.update.mockResolvedValueOnce(updatedUser);

    const result = await updateUserUseCase.execute(userId, updateData);

    expect(result).toEqual(updatedUser);
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(updateData.email);
    expect(userRepository.update).toHaveBeenCalledWith(userId, updateData);
  });

  it('should throw InternalServerErrorException on unexpected error', async () => {
    const userId = '65123456789abcdef1234567';
    const updateData = {
      name: 'Updated Name',
    };

    userRepository.findById.mockRejectedValueOnce(new Error('Database error'));

    await expect(updateUserUseCase.execute(userId, updateData)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should propagate HttpException', async () => {
    const userId = '65123456789abcdef1234567';
    const updateData = {
      name: 'Updated Name',
    };

    const httpError = new HttpException('Custom error', HttpStatus.BAD_REQUEST);
    userRepository.findById.mockRejectedValueOnce(httpError);

    await expect(updateUserUseCase.execute(userId, updateData)).rejects.toThrow(
      httpError,
    );
  });
});
