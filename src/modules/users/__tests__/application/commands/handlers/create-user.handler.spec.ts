import { Test } from '@nestjs/testing';
import { CreateUserHandler } from '../../../../application/commands/handlers/create-user.handler';
import { CreateUserCommand } from '../../../../application/commands/create-user.command';
import { ICreateUserUseCase } from '../../../../application/use-cases/commands/ports/create-user.use-case.interface';
import { mockUserEntity } from '../../../mocks/user.entity.mock';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let useCase: jest.Mocked<ICreateUserUseCase>;

  beforeEach(async () => {
    const createUserUseCase = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: ICreateUserUseCase,
          useValue: createUserUseCase,
        },
      ],
    }).compile();

    handler = moduleRef.get<CreateUserHandler>(CreateUserHandler);
    useCase = moduleRef.get(ICreateUserUseCase);
  });

  it('should execute create user use case', async () => {
    const command = new CreateUserCommand(
      'test@test.com',
      'Test User',
      'password',
    );
    useCase.execute.mockResolvedValue(mockUserEntity);

    const result = await handler.execute(command);

    expect(result).toBe(mockUserEntity);
    expect(useCase.execute).toHaveBeenCalledWith(
      command.email,
      command.name,
      command.password,
    );
  });
});
