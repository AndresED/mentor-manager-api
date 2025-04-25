import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRecipientsQuery } from '../get-recipients.query';
import { GetRecipientsUseCase } from '../../use-cases/get-recipients.use-case';
import { Recipient } from '../../../domain/entities/recipient.entity';

@QueryHandler(GetRecipientsQuery)
export class GetRecipientsHandler implements IQueryHandler<GetRecipientsQuery> {
  constructor(private getRecipientsUseCase: GetRecipientsUseCase) {}

  async execute(): Promise<Recipient[]> {
    return this.getRecipientsUseCase.execute();
  }
}
