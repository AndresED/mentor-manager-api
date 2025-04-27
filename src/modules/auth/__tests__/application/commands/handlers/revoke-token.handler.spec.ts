import { Test } from '@nestjs/testing';
import { RevokeTokenHandler } from '../../../../application/commands/handlers/revoke-token.handler';
import { RevokeTokenCommand } from '../../../../application/commands/revoke-token.command';
import { IRevokeTokenUseCase } from '../../../../application/use-cases/commands/ports/revoke-token.use-case.interface';

describe('RevokeTokenHandler', () => {
  let handler: RevokeTokenHandler;
  let mockRevokeTokenUseCase: jest.Mocked<IRevokeTokenUseCase>;

  beforeEach(async () => {
    mockRevokeTokenUseCase = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        RevokeTokenHandler,
        {
          provide: IRevokeTokenUseCase,
          useValue: mockRevokeTokenUseCase,
        },
      ],
    }).compile();

    handler = moduleRef.get<RevokeTokenHandler>(RevokeTokenHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should call revoke token use case with correct token', async () => {
    const mockToken = 'token-to-revoke';

    await handler.execute(new RevokeTokenCommand(mockToken));

    expect(mockRevokeTokenUseCase.execute).toHaveBeenCalledWith(mockToken);
  });
});
