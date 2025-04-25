import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTrackingCommand } from '../create-tracking.command';
import { CreateTrackingUseCase } from '../../use-cases/create-tracking.use-case';
import { Tracking } from '../../../domain/entities/tracking.entity';

@CommandHandler(CreateTrackingCommand)
export class CreateTrackingHandler
  implements ICommandHandler<CreateTrackingCommand>
{
  constructor(private createTrackingUseCase: CreateTrackingUseCase) {}

  async execute(command: CreateTrackingCommand): Promise<Tracking> {
    const { projectId, startDate, endDate, developer } = command;
    return this.createTrackingUseCase.execute(
      projectId,
      startDate,
      endDate,
      developer,
    );
  }
}
