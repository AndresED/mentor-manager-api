import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRecipientByIdQuery } from '../get-recipient-by-id.query';
import { GetRecipientByIdUseCase } from '../../use-cases/get-recipient-by-id.use-case';
import { Recipient } from '../../../domain/entities/recipient.entity';

@QueryHandler(GetRecipientByIdQuery)
export class GetRecipientByIdHandler
  implements IQueryHandler<GetRecipientByIdQuery>
{
  constructor(private getRecipientByIdUseCase: GetRecipientByIdUseCase) {}

  async execute(query: GetRecipientByIdQuery): Promise<Recipient> {
    return this.getRecipientByIdUseCase.execute(query.id);
  }
}
