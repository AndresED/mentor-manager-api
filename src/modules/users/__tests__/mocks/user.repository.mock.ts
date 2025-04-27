import { IUserRepositoryDomain } from '../../domain/repositories/user.repository.domain';
import { mockUserEntity, mockUserEntityList } from './user.entity.mock';
import { UserEntity } from '../../domain/entities/user.entity';

export const mockUserRepository: jest.Mocked<IUserRepositoryDomain> = {
  save: jest
    .fn()
    .mockImplementation((user: UserEntity) => Promise.resolve(mockUserEntity)),
  findById: jest.fn().mockResolvedValue(mockUserEntity),
  findByEmail: jest.fn().mockResolvedValue(null), // Default to null for new users
  findAll: jest.fn().mockResolvedValue(mockUserEntityList),
  update: jest.fn().mockResolvedValue(mockUserEntity),
  delete: jest.fn().mockResolvedValue(undefined),
};
