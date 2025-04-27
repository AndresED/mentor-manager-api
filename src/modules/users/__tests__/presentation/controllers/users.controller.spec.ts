import { Test } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport'; // Add this import
import { UsersController } from '../../../presentation/controllers/users.controller';
import { CreateUserCommand } from '../../../application/commands/create-user.command';
import { UpdateUserCommand } from '../../../application/commands/update-user.command';
import { DeleteUserCommand } from '../../../application/commands/delete-user.command';
import { GetUsersQuery } from '../../../application/queries/get-users.query';
import { GetUserByIdQuery } from '../../../application/queries/get-user-by-id.query';
import {
  mockUserEntity,
  mockUserEntityList,
} from '../../mocks/user.entity.mock';
import { IJwtServiceDomain } from '../../../../auth/domain/services/jwt.service.domain';
import { ITokenRepositoryDomain } from '../../../../auth/domain/repositories/token.repository.domain';

describe('UsersController', () => {
  let controller: UsersController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  const mockCommandBus = {
    execute: jest.fn(),
  };

  const mockQueryBus = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
        {
          provide: IJwtServiceDomain,
          useValue: {
            verifyToken: jest.fn().mockResolvedValue(true),
            generateToken: jest.fn().mockResolvedValue('token'),
          },
        },
        {
          provide: ITokenRepositoryDomain,
          useValue: {
            findByToken: jest.fn().mockResolvedValue(null),
            save: jest.fn(),
            deleteByToken: jest.fn(),
            deleteByUserId: jest.fn(),
            findByUserId: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = moduleRef.get<UsersController>(UsersController);
    commandBus = moduleRef.get(CommandBus);
    queryBus = moduleRef.get(QueryBus);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@test.com',
        name: 'Test User',
        password: 'password',
      };

      commandBus.execute.mockResolvedValueOnce(mockUserEntity);

      const result = await controller.createUser(createUserDto);

      expect(result).toBe(mockUserEntity);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new CreateUserCommand(
          createUserDto.email,
          createUserDto.name,
          createUserDto.password,
        ),
      );
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      queryBus.execute.mockResolvedValueOnce(mockUserEntityList);

      const result = await controller.getUsers();

      expect(result).toBe(mockUserEntityList);
      expect(queryBus.execute).toHaveBeenCalledWith(new GetUsersQuery());
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const userId = 'user-id';
      queryBus.execute.mockResolvedValueOnce(mockUserEntity);

      const result = await controller.getUserById(userId);

      expect(result).toBe(mockUserEntity);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetUserByIdQuery(userId),
      );
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const userId = 'user-id';
      const updateUserDto = { name: 'Updated Name' };

      commandBus.execute.mockResolvedValueOnce(mockUserEntity);

      const result = await controller.updateUser(userId, updateUserDto);

      expect(result).toBe(mockUserEntity);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new UpdateUserCommand(userId, updateUserDto),
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const userId = 'user-id';
      const response = { message: 'User deleted successfully' };

      commandBus.execute.mockResolvedValueOnce(response);

      const result = await controller.deleteUser(userId);

      expect(result).toEqual(response);
      expect(commandBus.execute).toHaveBeenCalledWith(
        new DeleteUserCommand(userId),
      );
    });
  });
});
