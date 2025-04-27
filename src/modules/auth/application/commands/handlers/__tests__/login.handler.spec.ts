import { Test } from '@nestjs/testing';
import { LoginHandler } from '../login.handler';
import { LoginCommand } from '../../login.command';
import { ILoginUseCase } from '../../../use-cases/commands/ports/login.use-case.interface';

describe('LoginHandler', () => {
  let handler: LoginHandler;
  let mockLoginUseCase: jest.Mocked<ILoginUseCase>;

  beforeEach(async () => {
    mockLoginUseCase = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginHandler,
        {
          provide: ILoginUseCase,
          useValue: mockLoginUseCase,
        },
      ],
    }).compile();

    handler = moduleRef.get<LoginHandler>(LoginHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should execute login command', async () => {
    const command = new LoginCommand('test@email.com', 'password123');
    const expectedResponse = {
      accessToken: 'token123',
      refreshToken: 'refreshToken123',
      user: {
        _id: '1',
        email: 'test@email.com',
        name: 'Test User',
      },
    };

    mockLoginUseCase.execute.mockResolvedValue(expectedResponse);

    const result = await handler.execute(command);

    expect(mockLoginUseCase.execute).toHaveBeenCalledWith({
      email: command.email,
      password: command.password,
    });
    expect(result).toEqual(expectedResponse);
  });
});
