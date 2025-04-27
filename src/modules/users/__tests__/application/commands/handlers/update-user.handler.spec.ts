import { Test } from '@nestjs/testing';
import { UpdateUserHandler } from '../../../../application/commands/handlers/update-user.handler';
import { UpdateUserCommand } from '../../../../application/commands/update-user.command';
import { IUpdateUserUseCase } from '../../../../application/use-cases/commands/ports/update-user.use-case.interface';
import { mockUserEntity } from '../../../mocks/user.entity.mock';

describe('UpdateUserHandler', () => {
  let handler: UpdateUserHandler;
  let useCase: jest.Mocked<IUpdateUserUseCase>;

  beforeEach(async () => {
    const updateUserUseCase = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateUserHandler,
        {
          provide: IUpdateUserUseCase,
          useValue: updateUserUseCase,
        },
      ],
    }).compile();

    handler = moduleRef.get<UpdateUserHandler>(UpdateUserHandler);
    useCase = moduleRef.get(IUpdateUserUseCase);
  });

  it('should execute update user use case', async () => {
    const updateData = { name: 'Updated Name' };
    const command = new UpdateUserCommand('user-id', updateData);
    useCase.execute.mockResolvedValue(mockUserEntity);

    const result = await handler.execute(command);

    expect(result).toBe(mockUserEntity);
    expect(useCase.execute).toHaveBeenCalledWith(
      command.id,
      command.updateData,
    );
  });
});
