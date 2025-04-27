import { Test } from '@nestjs/testing';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { ResetPasswordUseCase } from '../../../../application/use-cases/commands/reset-password.use-case';
import { IUserRepositoryDomain } from '../../../../../users/domain/repositories/user.repository.domain';
import { ITokenRepositoryDomain } from '../../../../domain/repositories/token.repository.domain';
import { IJwtServiceDomain } from '../../../../domain/services/jwt.service.domain';
import { UserEntity } from '../../../../../users/domain/entities/user.entity';
import { TokenEntity } from '../../../../domain/entities/token.entity';
import { PasswordUtils } from '../../../../../../shared/utils/password.utils';

jest.mock('../../../../../../shared/utils/password.utils');

describe('ResetPasswordUseCase', () => {
  let useCase: ResetPasswordUseCase;
  let mockUserRepository: jest.Mocked<IUserRepositoryDomain>;
  let mockTokenRepository: jest.Mocked<ITokenRepositoryDomain>;
  let mockJwtService: jest.Mocked<IJwtServiceDomain>;

  beforeEach(async () => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    } as any;

    mockTokenRepository = {
      save: jest.fn(),
      findByToken: jest.fn(),
      findByUserId: jest.fn(),
      deleteByToken: jest.fn(),
      deleteByUserId: jest.fn(),
    };

    mockJwtService = {
      generateToken: jest.fn(),
      verifyToken: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ResetPasswordUseCase,
        {
          provide: IUserRepositoryDomain,
          useValue: mockUserRepository,
        },
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

    useCase = moduleRef.get<ResetPasswordUseCase>(ResetPasswordUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should successfully reset password', async () => {
    const userId = '1';
    const token = 'valid-reset-token';
    const newPassword = 'newPassword123';
    const hashedPassword = 'hashedNewPassword';

    const mockUser = {
      _id: userId,
      email: 'test@email.com',
    } as UserEntity;

    const mockToken = {
      userId,
      token,
      type: 'reset',
      expiresAt: new Date(Date.now() + 3600000),
      isExpired: jest.fn().mockReturnValue(false),
    } as unknown as TokenEntity;

    mockJwtService.verifyToken.mockResolvedValue({
      sub: userId,
      email: 'test@email.com',
      type: 'password-reset',
    });
    mockTokenRepository.findByToken.mockResolvedValue(mockToken);
    mockUserRepository.findById.mockResolvedValue(mockUser);
    (PasswordUtils.hash as jest.Mock).mockResolvedValue(hashedPassword);
    mockUserRepository.update.mockResolvedValue({} as any);
    mockTokenRepository.deleteByToken.mockResolvedValue();

    await expect(useCase.execute(token, newPassword)).resolves.not.toThrow();

    expect(mockJwtService.verifyToken).toHaveBeenCalledWith(token);
    expect(mockTokenRepository.findByToken).toHaveBeenCalledWith(token);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(PasswordUtils.hash).toHaveBeenCalledWith(newPassword);
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, {
      password: hashedPassword,
    });
    expect(mockTokenRepository.deleteByToken).toHaveBeenCalledWith(token);
  });

  it('should throw unauthorized exception when token is invalid', async () => {
    mockJwtService.verifyToken.mockResolvedValue(null);

    await expect(
      useCase.execute('invalid-token', 'newPassword'),
    ).rejects.toThrow(HttpException);
  });

  it('should throw unauthorized exception when token type is not password-reset', async () => {
    mockJwtService.verifyToken.mockResolvedValue({
      sub: '1',
      email: 'test@email.com',
      type: 'access',
    });

    await expect(
      useCase.execute('wrong-type-token', 'newPassword'),
    ).rejects.toThrow(HttpException);
  });

  it('should throw unauthorized exception when stored token is not found', async () => {
    mockJwtService.verifyToken.mockResolvedValue({
      sub: '1',
      email: 'test@email.com',
      type: 'password-reset',
    });
    mockTokenRepository.findByToken.mockResolvedValue(null);

    await expect(
      useCase.execute('not-stored-token', 'newPassword'),
    ).rejects.toThrow(HttpException);
  });

  it('should throw unauthorized exception when token is expired', async () => {
    const mockToken = {
      userId: '1',
      token: 'expired-token',
      type: 'reset',
      expiresAt: new Date(Date.now() - 3600000),
      isExpired: jest.fn().mockReturnValue(true),
    } as unknown as TokenEntity;

    mockJwtService.verifyToken.mockResolvedValue({
      sub: '1',
      email: 'test@email.com',
      type: 'password-reset',
    });
    mockTokenRepository.findByToken.mockResolvedValue(mockToken);

    await expect(
      useCase.execute('expired-token', 'newPassword'),
    ).rejects.toThrow(HttpException);
  });

  it('should throw not found exception when user is not found', async () => {
    const mockToken = {
      userId: '1',
      token: 'valid-token',
      type: 'reset',
      expiresAt: new Date(Date.now() + 3600000),
      isExpired: jest.fn().mockReturnValue(false),
    } as unknown as TokenEntity;

    mockJwtService.verifyToken.mockResolvedValue({
      sub: '1',
      email: 'test@email.com',
      type: 'password-reset',
    });
    mockTokenRepository.findByToken.mockResolvedValue(mockToken);
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('valid-token', 'newPassword')).rejects.toThrow(
      HttpException,
    );
  });

  it('should throw InternalServerErrorException when an unexpected error occurs', async () => {
    const unexpectedError = new Error('Unexpected database error');
    mockJwtService.verifyToken.mockRejectedValue(unexpectedError);

    await expect(useCase.execute('token', 'newPassword')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
