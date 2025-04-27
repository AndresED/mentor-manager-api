import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { Tracking, TrackingSchema } from './domain/entities/tracking.entity';
import { TrackingRepository } from './infrastructure/repositories/tracking.repository';
import { TrackingController } from './infrastructure/controllers/tracking.controller';
import { CreateTrackingUseCase } from './application/use-cases/create-tracking.use-case';
import { UpdateTrackingUseCase } from './application/use-cases/update-tracking.use-case';
import { DeleteTrackingUseCase } from './application/use-cases/delete-tracking.use-case';
import { GetTrackingsUseCase } from './application/use-cases/get-trackings.use-case';
import { GetTrackingByIdUseCase } from './application/use-cases/get-tracking-by-id.use-case';
import { SendTrackingReportUseCase } from './application/use-cases/send-tracking-report.use-case';
import { CreateTrackingHandler } from './application/commands/handlers/create-tracking.handler';
import { UpdateTrackingHandler } from './application/commands/handlers/update-tracking.handler';
import { DeleteTrackingHandler } from './application/commands/handlers/delete-tracking.handler';
import { SendTrackingReportHandler } from './application/commands/handlers/send-tracking-report.handler';
import { GetTrackingsHandler } from './application/queries/handlers/get-trackings.handler';
import { GetTrackingByIdHandler } from './application/queries/handlers/get-tracking-by-id.handler';
import { EmailService } from '../../shared/infrastructure/services/email.service';
import { ProjectsModule } from '../projects/projects.module';
import { RecipientsModule } from '../recipients/recipients.module';
import { AuthModule } from '../auth/auth.module';

const CommandHandlers = [
  CreateTrackingHandler,
  UpdateTrackingHandler,
  DeleteTrackingHandler,
  SendTrackingReportHandler,
];

const QueryHandlers = [GetTrackingsHandler, GetTrackingByIdHandler];

const UseCases = [
  CreateTrackingUseCase,
  UpdateTrackingUseCase,
  DeleteTrackingUseCase,
  GetTrackingsUseCase,
  GetTrackingByIdUseCase,
  SendTrackingReportUseCase,
];

@Module({
  imports: [
    AuthModule,
    CqrsModule,
    MongooseModule.forFeature([
      { name: Tracking.name, schema: TrackingSchema },
    ]),
    ProjectsModule,
    RecipientsModule,
  ],
  controllers: [TrackingController],
  providers: [
    { provide: 'ITrackingRepository', useClass: TrackingRepository },
    EmailService,
    ...UseCases,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [{ provide: 'ITrackingRepository', useClass: TrackingRepository }],
})
export class TrackingModule {}
