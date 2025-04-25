import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipient, RecipientSchema } from './domain/entities/recipient.entity';
import { RecipientRepository } from './infrastructure/repositories/recipient.repository';
import { RecipientController } from './infrastructure/controllers/recipient.controller';
import { CreateRecipientUseCase } from './application/use-cases/create-recipient.use-case';
import { UpdateRecipientUseCase } from './application/use-cases/update-recipient.use-case';
import { DeleteRecipientUseCase } from './application/use-cases/delete-recipient.use-case';
import { GetRecipientsUseCase } from './application/use-cases/get-recipients.use-case';
import { GetRecipientByIdUseCase } from './application/use-cases/get-recipient-by-id.use-case';
import { CreateRecipientHandler } from './application/commands/handlers/create-recipient.handler';
import { UpdateRecipientHandler } from './application/commands/handlers/update-recipient.handler';
import { DeleteRecipientHandler } from './application/commands/handlers/delete-recipient.handler';
import { GetRecipientsHandler } from './application/queries/handlers/get-recipients.handler';
import { GetRecipientByIdHandler } from './application/queries/handlers/get-recipient-by-id.handler';

const CommandHandlers = [
  CreateRecipientHandler,
  UpdateRecipientHandler,
  DeleteRecipientHandler,
];

const QueryHandlers = [GetRecipientsHandler, GetRecipientByIdHandler];

const UseCases = [
  CreateRecipientUseCase,
  UpdateRecipientUseCase,
  DeleteRecipientUseCase,
  GetRecipientsUseCase,
  GetRecipientByIdUseCase,
];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Recipient.name, schema: RecipientSchema },
    ]),
  ],
  controllers: [RecipientController],
  providers: [
    { provide: 'IRecipientRepository', useClass: RecipientRepository },
    ...UseCases,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [{ provide: 'IRecipientRepository', useClass: RecipientRepository }],
})
export class RecipientsModule {}
