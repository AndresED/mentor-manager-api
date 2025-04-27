import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RevokeTokenUseCase } from '../../../../application/use-cases/commands/revoke-token.use-case';
import { ITokenRepositoryDomain } from '../../../../domain/repositories/token.repository.domain';
import { TokenEntity } from '../../../../domain/entities/token.entity';

describe('RevokeTokenUseCase', () => {
  let useCase: RevokeTokenUseCase;
  let mockTokenRepository: jest.Mocked<ITokenRepositoryDomain>;

  const mockToken = 'valid-token';

  beforeEach(async () => {
    mockTokenRepository = {
      findByToken: jest.fn(),
      deleteByToken: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        RevokeTokenUseCase,
        {
          provide: ITokenRepositoryDomain,
          useValue: mockTokenRepository,
        },
      ],
    }).compile();

    useCase = module.get<RevokeTokenUseCase>(RevokeTokenUseCase);
  });

  it('should successfully revoke a token', async () => {
    const mockStoredToken = new TokenEntity({
      userId: 'user-id',
      token: mockToken,
      type: 'access',
      expiresAt: new Date(Date.now() + 3600000),
    });

    mockTokenRepository.findByToken.mockResolvedValue(mockStoredToken);
    mockTokenRepository.deleteByToken.mockResolvedValue(undefined);

    await expect(useCase.execute(mockToken)).resolves.not.toThrow();
    expect(mockTokenRepository.deleteByToken).toHaveBeenCalledWith(mockToken);
  });

  it('should throw not found when token does not exist', async () => {
    mockTokenRepository.findByToken.mockResolvedValue(null);

    await expect(useCase.execute(mockToken)).rejects.toThrow(HttpException);
    await expect(useCase.execute(mockToken)).rejects.toMatchObject({
      status: HttpStatus.NOT_FOUND,
    });
    expect(mockTokenRepository.deleteByToken).not.toHaveBeenCalled();
  });

  it('should throw internal server error on unexpected errors', async () => {
    mockTokenRepository.findByToken.mockRejectedValue(
      new Error('Database error'),
    );

    await expect(useCase.execute(mockToken)).rejects.toThrow('Database error');
    expect(mockTokenRepository.deleteByToken).not.toHaveBeenCalled();
  });
});
