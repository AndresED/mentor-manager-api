import { Test } from '@nestjs/testing';
import { RefreshTokenHandler } from '../../../../application/commands/handlers/refresh-token.handler';
import { RefreshTokenCommand } from '../../../../application/commands/refresh-token.command';
import { IRefreshTokenUseCase } from '../../../../application/use-cases/commands/ports/refresh-token.use-case.interface';

describe('RefreshTokenHandler', () => {
  let handler: RefreshTokenHandler;
  let mockRefreshTokenUseCase: jest.Mocked<IRefreshTokenUseCase>;

  beforeEach(async () => {
    mockRefreshTokenUseCase = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        RefreshTokenHandler,
        {
          provide: IRefreshTokenUseCase,
          useValue: mockRefreshTokenUseCase,
        },
      ],
    }).compile();

    handler = moduleRef.get<RefreshTokenHandler>(RefreshTokenHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call refresh token use case with correct token', async () => {
    const mockToken = 'refresh-token';
    const mockResponse = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    mockRefreshTokenUseCase.execute.mockResolvedValue(mockResponse);

    const result = await handler.execute(new RefreshTokenCommand(mockToken));

    expect(result).toBe(mockResponse);
    expect(mockRefreshTokenUseCase.execute).toHaveBeenCalledWith(mockToken);
  });
});
