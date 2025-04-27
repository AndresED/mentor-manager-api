import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from '../refresh-token.command';
import { IRefreshTokenUseCase } from '../../use-cases/commands/ports/refresh-token.use-case.interface';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(private readonly refreshTokenUseCase: IRefreshTokenUseCase) {}

  async execute(command: RefreshTokenCommand) {
    return await this.refreshTokenUseCase.execute(command.refreshToken);
  }
}
