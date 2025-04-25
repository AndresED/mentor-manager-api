import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRecipientCommand } from '../create-recipient.command';
import { CreateRecipientUseCase } from '../../use-cases/create-recipient.use-case';
import { Recipient } from '../../../domain/entities/recipient.entity';

@CommandHandler(CreateRecipientCommand)
export class CreateRecipientHandler
  implements ICommandHandler<CreateRecipientCommand>
{
  constructor(private createRecipientUseCase: CreateRecipientUseCase) {}

  async execute(command: CreateRecipientCommand): Promise<Recipient> {
    const { name, email, role } = command;
    return this.createRecipientUseCase.execute(name, email, role);
  }
}
