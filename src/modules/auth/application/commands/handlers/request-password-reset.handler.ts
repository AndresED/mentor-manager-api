import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestPasswordResetCommand } from '../request-password-reset.command';
import { IRequestPasswordResetUseCase } from '../../use-cases/commands/ports/request-password-reset.use-case.interface';

@CommandHandler(RequestPasswordResetCommand)
export class RequestPasswordResetHandler
  implements ICommandHandler<RequestPasswordResetCommand>
{
  constructor(
    private readonly requestPasswordResetUseCase: IRequestPasswordResetUseCase,
  ) {}

  async execute(command: RequestPasswordResetCommand): Promise<void> {
    await this.requestPasswordResetUseCase.execute({
      email: command.email,
    });
  }
}
