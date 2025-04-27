import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordCommand } from '../reset-password.command';
import { IResetPasswordUseCase } from '../../use-cases/commands/ports/reset-password.use-case.interface';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
  implements ICommandHandler<ResetPasswordCommand>
{
  constructor(private readonly resetPasswordUseCase: IResetPasswordUseCase) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    await this.resetPasswordUseCase.execute(command.token, command.newPassword);
  }
}
