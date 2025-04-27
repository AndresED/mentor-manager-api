import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RevokeTokenCommand } from '../revoke-token.command';
import { IRevokeTokenUseCase } from '../../use-cases/commands/ports/revoke-token.use-case.interface';

@CommandHandler(RevokeTokenCommand)
export class RevokeTokenHandler implements ICommandHandler<RevokeTokenCommand> {
  constructor(private readonly revokeTokenUseCase: IRevokeTokenUseCase) {}

  async execute(command: RevokeTokenCommand): Promise<void> {
    await this.revokeTokenUseCase.execute(command.token);
  }
}
