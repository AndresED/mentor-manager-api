import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../dtos/login.dto';
import { RequestPasswordResetDto } from '../dtos/request-password-reset.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { LoginCommand } from '../../application/commands/login.command';
import { RequestPasswordResetCommand } from '../../application/commands/request-password-reset.command';
import { ResetPasswordCommand } from '../../application/commands/reset-password.command';
import { SwaggerApiErrorResponses } from '../../../../shared/infrastructure/decorators/swagger-api-error-responses.decorator';
import { RefreshTokenCommand } from '../../application/commands/refresh-token.command';
import { RevokeTokenCommand } from '../../application/commands/revoke-token.command';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RevokeTokenDto } from '../dtos/revoke-token.dto';

@SwaggerApiErrorResponses()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return await this.commandBus.execute(
      new LoginCommand(loginDto.email, loginDto.password),
    );
  }

  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Reset email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async requestPasswordReset(@Body() requestDto: RequestPasswordResetDto) {
    return await this.commandBus.execute(
      new RequestPasswordResetCommand(requestDto.email),
    );
  }

  @Post('password-reset/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  async resetPassword(@Body() resetDto: ResetPasswordDto) {
    return await this.commandBus.execute(
      new ResetPasswordCommand(resetDto.token, resetDto.newPassword),
    );
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.commandBus.execute(
      new RefreshTokenCommand(refreshTokenDto.refreshToken),
    );
  }

  @Post('revoke-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke a specific token' })
  @ApiResponse({ status: 200, description: 'Token revoked successfully' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async revokeToken(@Body() revokeTokenDto: RevokeTokenDto) {
    return await this.commandBus.execute(
      new RevokeTokenCommand(revokeTokenDto.token),
    );
  }
}
