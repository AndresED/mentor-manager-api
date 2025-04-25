import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTrackingCommand } from '../update-tracking.command';
import { UpdateTrackingUseCase } from '../../use-cases/update-tracking.use-case';
import {
  Tracking,
  TrackingStatus,
} from '../../../domain/entities/tracking.entity';

@CommandHandler(UpdateTrackingCommand)
export class UpdateTrackingHandler
  implements ICommandHandler<UpdateTrackingCommand>
{
  constructor(private readonly updateTrackingUseCase: UpdateTrackingUseCase) {}

  async execute(command: UpdateTrackingCommand): Promise<Tracking> {
    const { id, ...commandData } = command;

    // Convertir el status de string a enum si existe
    const data: Partial<Tracking> = { ...commandData };
    if (commandData.status) {
      data.status = commandData.status as unknown as TrackingStatus;
    }

    return this.updateTrackingUseCase.execute(id, data);
  }
}
