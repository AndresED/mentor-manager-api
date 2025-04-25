import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTrackingCommand } from '../delete-tracking.command';
import { DeleteTrackingUseCase } from '../../use-cases/delete-tracking.use-case';

@CommandHandler(DeleteTrackingCommand)
export class DeleteTrackingHandler
  implements ICommandHandler<DeleteTrackingCommand>
{
  constructor(private deleteTrackingUseCase: DeleteTrackingUseCase) {}

  async execute(command: DeleteTrackingCommand): Promise<boolean> {
    return this.deleteTrackingUseCase.execute(command.id);
  }
}
