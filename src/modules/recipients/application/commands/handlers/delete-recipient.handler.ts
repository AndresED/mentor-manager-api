import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteRecipientCommand } from '../delete-recipient.command';
import { DeleteRecipientUseCase } from '../../use-cases/delete-recipient.use-case';

@CommandHandler(DeleteRecipientCommand)
export class DeleteRecipientHandler
  implements ICommandHandler<DeleteRecipientCommand>
{
  constructor(private deleteRecipientUseCase: DeleteRecipientUseCase) {}

  async execute(command: DeleteRecipientCommand): Promise<boolean> {
    return this.deleteRecipientUseCase.execute(command.id);
  }
}
