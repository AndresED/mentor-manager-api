import { Test } from '@nestjs/testing';
import { DeleteUserHandler } from '../../../../application/commands/handlers/delete-user.handler';
import { DeleteUserCommand } from '../../../../application/commands/delete-user.command';
import { IDeleteUserUseCase } from '../../../../application/use-cases/commands/ports/delete-user.use-case.interface';

describe('DeleteUserHandler', () => {
  let handler: DeleteUserHandler;
  let useCase: jest.Mocked<IDeleteUserUseCase>;

  beforeEach(async () => {
    const deleteUserUseCase = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        DeleteUserHandler,
        {
          provide: IDeleteUserUseCase,
          useValue: deleteUserUseCase,
        },
      ],
    }).compile();

    handler = moduleRef.get<DeleteUserHandler>(DeleteUserHandler);
    useCase = moduleRef.get(IDeleteUserUseCase);
  });

  it('should execute delete user use case', async () => {
    const command = new DeleteUserCommand('user-id');
    useCase.execute.mockResolvedValue(undefined);

    const result = await handler.execute(command);

    expect(result).toEqual({ message: 'User deleted successfully' });
    expect(useCase.execute).toHaveBeenCalledWith(command.id);
  });
});
