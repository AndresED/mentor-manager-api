import { Test } from '@nestjs/testing';
import { ResetPasswordHandler } from '../reset-password.handler';
import { ResetPasswordCommand } from '../../reset-password.command';
import { IResetPasswordUseCase } from '../../../use-cases/commands/ports/reset-password.use-case.interface';

describe('ResetPasswordHandler', () => {
  let handler: ResetPasswordHandler;
  let mockResetPasswordUseCase: jest.Mocked<IResetPasswordUseCase>;

  beforeEach(async () => {
    mockResetPasswordUseCase = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ResetPasswordHandler,
        {
          provide: IResetPasswordUseCase,
          useValue: mockResetPasswordUseCase,
        },
      ],
    }).compile();

    handler = moduleRef.get<ResetPasswordHandler>(ResetPasswordHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should execute reset password command', async () => {
    const command = new ResetPasswordCommand('token123', 'newPassword123');

    await handler.execute(command);

    expect(mockResetPasswordUseCase.execute).toHaveBeenCalledWith(
      command.token,
      command.newPassword,
    );
  });
});
