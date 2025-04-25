import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRecipientCommand } from '../update-recipient.command';
import { UpdateRecipientUseCase } from '../../use-cases/update-recipient.use-case';
import { Recipient } from '../../../domain/entities/recipient.entity';

@CommandHandler(UpdateRecipientCommand)
export class UpdateRecipientHandler
  implements ICommandHandler<UpdateRecipientCommand>
{
  constructor(private updateRecipientUseCase: UpdateRecipientUseCase) {}

  async execute(command: UpdateRecipientCommand): Promise<Recipient> {
    const { id, ...data } = command;
    return this.updateRecipientUseCase.execute(id, data);
  }
}
