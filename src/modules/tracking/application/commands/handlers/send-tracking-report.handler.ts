import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendTrackingReportCommand } from '../send-tracking-report.command';
import { SendTrackingReportUseCase } from '../../use-cases/send-tracking-report.use-case';

@CommandHandler(SendTrackingReportCommand)
export class SendTrackingReportHandler
  implements ICommandHandler<SendTrackingReportCommand>
{
  constructor(private sendTrackingReportUseCase: SendTrackingReportUseCase) {}

  async execute(command: SendTrackingReportCommand): Promise<boolean> {
    return this.sendTrackingReportUseCase.execute(command.trackingId);
  }
}
