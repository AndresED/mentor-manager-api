import { Test } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { AuthController } from '../../../presentation/controllers/auth.controller';
import { LoginCommand } from '../../../application/commands/login.command';
import { RequestPasswordResetCommand } from '../../../application/commands/request-password-reset.command';
import { ResetPasswordCommand } from '../../../application/commands/reset-password.command';
import { LoginDto } from '../../../presentation/dtos/login.dto';
import { RequestPasswordResetDto } from '../../../presentation/dtos/request-password-reset.dto';
import { ResetPasswordDto } from '../../../presentation/dtos/reset-password.dto';
import { RefreshTokenCommand } from '../../../application/commands/refresh-token.command';
import { RevokeTokenCommand } from '../../../application/commands/revoke-token.command';

describe('AuthController', () => {
  let controller: AuthController;
  let commandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    const mockCommandBus = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
    commandBus = moduleRef.get<CommandBus>(
      CommandBus,
    ) as jest.Mocked<CommandBus>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should execute LoginCommand with correct parameters', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult = {
        accessToken: 'token123',
        user: {
          _id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      commandBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new LoginCommand(loginDto.email, loginDto.password),
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('requestPasswordReset', () => {
    it('should execute RequestPasswordResetCommand with correct parameters', async () => {
      const requestDto: RequestPasswordResetDto = {
        email: 'test@example.com',
      };

      commandBus.execute.mockResolvedValue(undefined);

      const result = await controller.requestPasswordReset(requestDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new RequestPasswordResetCommand(requestDto.email),
      );
      expect(result).toBeUndefined();
    });
  });

  describe('resetPassword', () => {
    it('should execute ResetPasswordCommand with correct parameters', async () => {
      const resetDto: ResetPasswordDto = {
        token: 'reset-token-123',
        newPassword: 'newPassword123',
      };

      commandBus.execute.mockResolvedValue(undefined);

      const result = await controller.resetPassword(resetDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new ResetPasswordCommand(resetDto.token, resetDto.newPassword),
      );
      expect(result).toBeUndefined();
    });
  });

  describe('refreshToken', () => {
    it('should execute RefreshTokenCommand with correct parameters', async () => {
      const refreshTokenDto = { refreshToken: 'refresh-token-123' };
      const expectedResult = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      commandBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new RefreshTokenCommand(refreshTokenDto.refreshToken),
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('revokeToken', () => {
    it('should execute RevokeTokenCommand with correct parameters', async () => {
      const revokeTokenDto = { token: 'revoke-token-123' };
      const expectedResult = { message: 'Token revoked' };

      commandBus.execute.mockResolvedValue(expectedResult);

      const result = await controller.revokeToken(revokeTokenDto);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new RevokeTokenCommand(revokeTokenDto.token),
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
