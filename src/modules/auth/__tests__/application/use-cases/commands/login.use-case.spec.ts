import { Test } from '@nestjs/testing';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { LoginUseCase } from '../../../../application/use-cases/commands/login.use-case';
import { IUserRepositoryDomain } from '../../../../../users/domain/repositories/user.repository.domain';
import { ITokenRepositoryDomain } from '../../../../domain/repositories/token.repository.domain';
import { IJwtServiceDomain } from '../../../../domain/services/jwt.service.domain';
import { PasswordUtils } from '../../../../../../shared/utils/password.utils';
import { UserEntity } from '../../../../../users/domain/entities/user.entity';
import { TimeUtils } from '../../../../../../shared/utils/time.utils';

jest.mock('../../../../../../shared/utils/password.utils');

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
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
        LoginUseCase,
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

    useCase = moduleRef.get<LoginUseCase>(LoginUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should successfully login a user', async () => {
    const mockUser = new UserEntity({
      _id: '1',
      email: 'test@email.com',
      name: 'Test User',
      password: 'hashedPassword123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const credentials = {
      email: 'test@email.com',
      password: 'password123',
    };

    const mockToken = 'generatedToken123';
    const mockRefreshToken = 'generatedRefreshToken123';

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    (PasswordUtils.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.generateToken
      .mockResolvedValueOnce(mockToken)
      .mockResolvedValueOnce(mockRefreshToken);

    const result = await useCase.execute(credentials);

    expect(result).toEqual({
      accessToken: mockToken,
      refreshToken: mockRefreshToken,
      user: {
        _id: mockUser._id,
        email: mockUser.email,
        name: mockUser.name,
      },
    });

    // Verify that tokens were saved
    expect(mockTokenRepository.save).toHaveBeenCalledTimes(2);
  });

  it('should throw unauthorized exception when user is not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: 'nonexistent@email.com',
        password: 'password123',
      }),
    ).rejects.toThrow(HttpException);
  });

  it('should throw unauthorized exception when password is invalid', async () => {
    const mockUser = {
      _id: '1',
      email: 'test@email.com',
      password: 'hashedPassword',
    } as UserEntity;

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    (PasswordUtils.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'test@email.com', password: 'wrongPassword' }),
    ).rejects.toThrow(HttpException);
  });

  it('should throw InternalServerErrorException when an unexpected error occurs', async () => {
    const unexpectedError = new Error('Unexpected database error');
    mockUserRepository.findByEmail.mockRejectedValue(unexpectedError);

    await expect(
      useCase.execute({ email: 'test@email.com', password: 'password123' }),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw unauthorized when user is not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'notfound@email.com', password: 'pass' }),
    ).rejects.toThrow(HttpException);
  });

  it('should throw unauthorized when password is invalid', async () => {
    const mockUser = { _id: '1', email: 'test@email.com', password: 'hashed' };
    mockUserRepository.findByEmail.mockResolvedValue(mockUser as any);
    (PasswordUtils.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      useCase.execute({ email: 'test@email.com', password: 'wrong' }),
    ).rejects.toThrow(HttpException);
  });

  it('should throw InternalServerErrorException on unexpected error', async () => {
    mockUserRepository.findByEmail.mockRejectedValue(new Error('Unexpected'));

    await expect(
      useCase.execute({ email: 'test@email.com', password: 'pass' }),
    ).rejects.toThrowError('Unexpected');
  });

  it('should use "1h" as default access token expiration if env is not set', async () => {
    const originalEnv = process.env.JWT_EXPIRATION;
    delete process.env.JWT_EXPIRATION;

    const mockUser = new UserEntity({
      _id: '1',
      email: 'test@email.com',
      name: 'Test User',
      password: 'hashedPassword123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const credentials = {
      email: 'test@email.com',
      password: 'password123',
    };

    const mockToken = 'generatedToken123';
    const mockRefreshToken = 'generatedRefreshToken123';

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    (PasswordUtils.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.generateToken
      .mockResolvedValueOnce(mockToken)
      .mockResolvedValueOnce(mockRefreshToken);

    const parseDurationSpy = jest.spyOn(TimeUtils, 'parseDuration');

    await useCase.execute(credentials);

    expect(parseDurationSpy).toHaveBeenCalledWith('1h');

    process.env.JWT_EXPIRATION = originalEnv;
    parseDurationSpy.mockRestore();
  });

  it('should use "7d" as default refresh token expiration if env is not set', async () => {
    const originalEnv = process.env.JWT_REFRESH_EXPIRATION;
    delete process.env.JWT_REFRESH_EXPIRATION;

    const mockUser = new UserEntity({
      _id: '1',
      email: 'test@email.com',
      name: 'Test User',
      password: 'hashedPassword123',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const credentials = {
      email: 'test@email.com',
      password: 'password123',
    };

    const mockToken = 'generatedToken123';
    const mockRefreshToken = 'generatedRefreshToken123';

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    (PasswordUtils.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.generateToken
      .mockResolvedValueOnce(mockToken)
      .mockResolvedValueOnce(mockRefreshToken);

    const parseDurationSpy = jest.spyOn(TimeUtils, 'parseDuration');

    await useCase.execute(credentials);

    expect(parseDurationSpy).toHaveBeenCalledWith('7d');

    process.env.JWT_REFRESH_EXPIRATION = originalEnv;
    parseDurationSpy.mockRestore();
  });
});
