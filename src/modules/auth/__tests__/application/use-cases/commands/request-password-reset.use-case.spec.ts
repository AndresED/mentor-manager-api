import { Test } from '@nestjs/testing';
import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { RequestPasswordResetUseCase } from '../../../../application/use-cases/commands/request-password-reset.use-case';
import { IUserRepositoryDomain } from '../../../../../users/domain/repositories/user.repository.domain';
import { ITokenRepositoryDomain } from '../../../../domain/repositories/token.repository.domain';
import { IJwtServiceDomain } from '../../../../domain/services/jwt.service.domain';
import { IEmailService } from '../../../../../../shared/infrastructure/services/email/sengrind.service.interface';
import { UserEntity } from '../../../../../users/domain/entities/user.entity';

describe('RequestPasswordResetUseCase', () => {
  let useCase: RequestPasswordResetUseCase;
  let mockUserRepository: jest.Mocked<IUserRepositoryDomain>;
  let mockTokenRepository: jest.Mocked<ITokenRepositoryDomain>;
  let mockJwtService: jest.Mocked<IJwtServiceDomain>;
  let mockEmailService: jest.Mocked<IEmailService>;

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

    mockEmailService = {
      sendEmail: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        RequestPasswordResetUseCase,
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
        {
          provide: 'EmailServiceInterface',
          useValue: mockEmailService,
        },
      ],
    }).compile();

    useCase = moduleRef.get<RequestPasswordResetUseCase>(
      RequestPasswordResetUseCase,
    );

    // Mock environment variables
    process.env.SENDGRID_RESET_PASSWORD_TEMPLATE_ID = 'template-id';
    process.env.FRONTEND_URL = 'http://localhost:3000';
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should successfully request password reset', async () => {
    const mockUser = {
      _id: '1',
      email: 'test@email.com',
      name: 'Test User',
    } as UserEntity;
    const mockToken = 'reset-token-123';

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockTokenRepository.deleteByUserId.mockResolvedValue();
    mockJwtService.generateToken.mockResolvedValue(mockToken);
    mockTokenRepository.save.mockResolvedValue({} as any);
    mockEmailService.sendEmail.mockResolvedValue();

    await expect(
      useCase.execute({ email: 'test@email.com' }),
    ).resolves.not.toThrow();

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'test@email.com',
    );
    expect(mockTokenRepository.deleteByUserId).toHaveBeenCalledWith(
      mockUser._id,
    );
    expect(mockJwtService.generateToken).toHaveBeenCalledWith({
      sub: mockUser._id,
      email: mockUser.email,
      type: 'password-reset',
    });
    expect(mockTokenRepository.save).toHaveBeenCalled();
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      mockUser.email,
      'template-id',
      {
        name: mockUser.name,
        resetLink: `http://localhost:3000/reset-password?token=${mockToken}`,
      },
    );
  });

  it('should use empty string for template ID when environment variable is not set', async () => {
    // Save original value
    const originalTemplateId = process.env.SENDGRID_RESET_PASSWORD_TEMPLATE_ID;
    // Remove environment variable
    delete process.env.SENDGRID_RESET_PASSWORD_TEMPLATE_ID;

    const mockUser = {
      _id: '1',
      email: 'test@email.com',
      name: 'Test User',
    } as UserEntity;
    const mockToken = 'reset-token-123';

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockTokenRepository.deleteByUserId.mockResolvedValue();
    mockJwtService.generateToken.mockResolvedValue(mockToken);
    mockTokenRepository.save.mockResolvedValue({} as any);
    mockEmailService.sendEmail.mockResolvedValue();

    await expect(
      useCase.execute({ email: 'test@email.com' }),
    ).resolves.not.toThrow();

    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      mockUser.email,
      '', // Empty string when env var is not set
      expect.any(Object),
    );

    // Restore original value
    process.env.SENDGRID_RESET_PASSWORD_TEMPLATE_ID = originalTemplateId;
  });

  it('should throw not found exception when user is not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'nonexistent@email.com' }),
    ).rejects.toThrow(HttpException);
  });

  it('should throw InternalServerErrorException when an unexpected error occurs', async () => {
    const unexpectedError = new Error('Unexpected database error');
    mockUserRepository.findByEmail.mockRejectedValue(unexpectedError);

    await expect(useCase.execute({ email: 'test@email.com' })).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
