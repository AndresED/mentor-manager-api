import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { Token, TokenSchema } from './infrastructure/schemas/token.schema';
import { AuthController } from './presentation/controllers/auth.controller';
import { TokenRepository } from './infrastructure/repositories/token.repository';
import { ITokenRepositoryDomain } from './domain/repositories/token.repository.domain';

// Use Cases
import { LoginUseCase } from './application/use-cases/commands/login.use-case';
import { RequestPasswordResetUseCase } from './application/use-cases/commands/request-password-reset.use-case';
import { ResetPasswordUseCase } from './application/use-cases/commands/reset-password.use-case';

// Use Case Interfaces
import { ILoginUseCase } from './application/use-cases/commands/ports/login.use-case.interface';
import { IRequestPasswordResetUseCase } from './application/use-cases/commands/ports/request-password-reset.use-case.interface';
import { IResetPasswordUseCase } from './application/use-cases/commands/ports/reset-password.use-case.interface';
import { LoginHandler } from './application/commands/handlers/login.handler';
import { ResetPasswordHandler } from './application/commands/handlers/reset-password.handler';
import { RequestPasswordResetHandler } from './application/commands/handlers/request-password-reset.handler';
import { IJwtServiceDomain } from './domain/services/jwt.service.domain';
import { JwtService } from './infrastructure/services/jwt.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenHandler } from './application/commands/handlers/refresh-token.handler';
import { RevokeTokenHandler } from './application/commands/handlers/revoke-token.handler';
import { IRefreshTokenUseCase } from './application/use-cases/commands/ports/refresh-token.use-case.interface';
import { RefreshTokenUseCase } from './application/use-cases/commands/refresh-token.use-case';
import { IRevokeTokenUseCase } from './application/use-cases/commands/ports/revoke-token.use-case.interface';
import { RevokeTokenUseCase } from './application/use-cases/commands/revoke-token.use-case';

const UseCases = [
  { provide: ILoginUseCase, useClass: LoginUseCase },
  {
    provide: IRequestPasswordResetUseCase,
    useClass: RequestPasswordResetUseCase,
  },
  { provide: IResetPasswordUseCase, useClass: ResetPasswordUseCase },
  { provide: IRefreshTokenUseCase, useClass: RefreshTokenUseCase },
  { provide: IRevokeTokenUseCase, useClass: RevokeTokenUseCase },
];
const CommandHandlers = [
  LoginHandler,
  RequestPasswordResetHandler,
  ResetPasswordHandler,
  RefreshTokenHandler,
  RevokeTokenHandler,
];
const AUTH_PROVIDERS = [
  { provide: IJwtServiceDomain, useClass: JwtService },
  { provide: ITokenRepositoryDomain, useClass: TokenRepository },
  { provide: ITokenRepositoryDomain, useClass: TokenRepository },
  ...UseCases,
  ...CommandHandlers,
  JwtStrategy,
];
@Module({
  imports: [
    CqrsModule,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'your-secret-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION ?? '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: AUTH_PROVIDERS,
  exports: AUTH_PROVIDERS,
})
export class AuthModule {}
