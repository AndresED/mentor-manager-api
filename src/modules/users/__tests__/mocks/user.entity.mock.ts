import { UserEntity } from '../../domain/entities/user.entity';

export const mockUserEntity = new UserEntity({
  _id: '65123456789abcdef1234567',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashedPassword123',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
});

export const mockUserEntityList = [
  mockUserEntity,
  new UserEntity({
    _id: '65123456789abcdef1234568',
    email: 'test2@example.com',
    name: 'Test User 2',
    password: 'hashedPassword456',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  }),
];
