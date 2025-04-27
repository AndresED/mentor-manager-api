import { Test } from '@nestjs/testing';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { RefreshTokenUseCase } from '../../../../application/use-cases/commands/refresh-token.use-case';
import { ITokenRepositoryDomain } from '../../../../domain/repositories/token.repository.domain';
import { IJwtServiceDomain } from '../../../../domain/services/jwt.service.domain';
import { TokenEntity } from '../../../../domain/entities/token.entity';
import { TimeUtils } from '../../../../../../shared/utils/time.utils';

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;
  let mockTokenRepository: jest.Mocked<ITokenRepositoryDomain>;
  let mockJwtService: jest.Mocked<IJwtServiceDomain>;

  const mockToken = 'valid-refresh-token';
  const mockPayload = {
    sub: 'user-id',
    email: 'test@example.com',
    type: 'refresh',
  };

  beforeEach(async () => {
    mockTokenRepository = {
      findByToken: jest.fn(),
      save: jest.fn(),
      deleteByToken: jest.fn(),
    } as any;

    mockJwtService = {
      verifyToken: jest.fn(),
      generateToken: jest.fn(),
    } as any;

    const module = await Test.createTestingModule({
      providers: [
        RefreshTokenUseCase,
        {
          provide: ITokenRepositoryDomain,
          useValue: mockTokenRepository,
        },
        {
          provide: IJwtServiceDomain,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    useCase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
  });

  it('should successfully refresh tokens', async () => {
    const mockStoredToken = new TokenEntity({
      userId: 'user-id',
      token: mockToken,
      type: 'refresh',
      expiresAt: new Date(Date.now() + 3600000),
    });

    const newAccessToken = 'new-access-token';
    const newRefreshToken = 'new-refresh-token';

    mockTokenRepository.findByToken.mockResolvedValue(mockStoredToken);
    mockJwtService.verifyToken.mockResolvedValue(mockPayload);
    mockJwtService.generateToken.mockResolvedValueOnce(newAccessToken);
    mockJwtService.generateToken.mockResolvedValueOnce(newRefreshToken);

    const result = await useCase.execute(mockToken);

    expect(result).toEqual({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
    expect(mockTokenRepository.deleteByToken).toHaveBeenCalledWith(mockToken);
    expect(mockTokenRepository.save).toHaveBeenCalled();
  });

  it('should throw unauthorized when token not found', async () => {
    mockTokenRepository.findByToken.mockResolvedValue(null);

    try {
      await useCase.execute(mockToken);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
      expect(error.getResponse()).toEqual({
        message: 'Invalid or expired refresh token',
      });
    }
  });

  it('should throw unauthorized when token is expired', async () => {
    const expiredToken = new TokenEntity({
      userId: 'user-id',
      token: mockToken,
      type: 'refresh',
      expiresAt: new Date(Date.now() + 1000), // Set it to future first
    });

    // Manually override the expiration after creation
    expiredToken.expiresAt = new Date(Date.now() - 1000);

    mockTokenRepository.findByToken.mockResolvedValue(expiredToken);

    await expect(useCase.execute(mockToken)).rejects.toThrow(HttpException);
    await expect(useCase.execute(mockToken)).rejects.toMatchObject({
      status: HttpStatus.UNAUTHORIZED,
    });
  });

  it('should throw unauthorized when token verification fails', async () => {
    const validToken = new TokenEntity({
      userId: 'user-id',
      token: mockToken,
      type: 'refresh',
      expiresAt: new Date(Date.now() + 3600000),
    });

    mockTokenRepository.findByToken.mockResolvedValue(validToken);
    mockJwtService.verifyToken.mockResolvedValue(null);

    await expect(useCase.execute(mockToken)).rejects.toThrow(HttpException);
    await expect(useCase.execute(mockToken)).rejects.toMatchObject({
      status: HttpStatus.UNAUTHORIZED,
    });
  });

  it('should use "7d" as default expiration if env is not set', async () => {
    // Save and clear the env variable
    const originalEnv = process.env.JWT_REFRESH_EXPIRATION;
    delete process.env.JWT_REFRESH_EXPIRATION;

    const mockStoredToken = new TokenEntity({
      userId: 'user-id',
      token: mockToken,
      type: 'refresh',
      expiresAt: new Date(Date.now() + 3600000),
    });

    const newAccessToken = 'new-access-token';
    const newRefreshToken = 'new-refresh-token';

    mockTokenRepository.findByToken.mockResolvedValue(mockStoredToken);
    mockJwtService.verifyToken.mockResolvedValue(mockPayload);
    mockJwtService.generateToken.mockResolvedValueOnce(newAccessToken);
    mockJwtService.generateToken.mockResolvedValueOnce(newRefreshToken);

    // Use direct import for spy
    const parseDurationSpy = jest.spyOn(TimeUtils, 'parseDuration');

    await useCase.execute(mockToken);

    expect(parseDurationSpy).toHaveBeenCalledWith('7d');

    // Restore env variable
    process.env.JWT_REFRESH_EXPIRATION = originalEnv;
    parseDurationSpy.mockRestore();
  });

  it('should throw InternalServerErrorException on unexpected error', async () => {
    // Force an unexpected error in the repository
    mockTokenRepository.findByToken.mockRejectedValue(new Error('Unexpected'));

    await expect(useCase.execute(mockToken)).rejects.toThrowError('Unexpected');
    await expect(useCase.execute(mockToken)).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
