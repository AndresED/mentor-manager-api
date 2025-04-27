import { Test } from '@nestjs/testing';
import { RequestPasswordResetHandler } from '../request-password-reset.handler';
import { RequestPasswordResetCommand } from '../../request-password-reset.command';
import { IRequestPasswordResetUseCase } from '../../../use-cases/commands/ports/request-password-reset.use-case.interface';

describe('RequestPasswordResetHandler', () => {
  let handler: RequestPasswordResetHandler;
  let mockRequestPasswordResetUseCase: jest.Mocked<IRequestPasswordResetUseCase>;

  beforeEach(async () => {
    mockRequestPasswordResetUseCase = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        RequestPasswordResetHandler,
        {
          provide: IRequestPasswordResetUseCase,
          useValue: mockRequestPasswordResetUseCase,
        },
      ],
    }).compile();

    handler = moduleRef.get<RequestPasswordResetHandler>(
      RequestPasswordResetHandler,
    );
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should execute request password reset command', async () => {
    const command = new RequestPasswordResetCommand('test@email.com');

    await handler.execute(command);

    expect(mockRequestPasswordResetUseCase.execute).toHaveBeenCalledWith({
      email: command.email,
    });
  });
});
