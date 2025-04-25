import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTrackingByIdQuery } from '../get-tracking-by-id.query';
import { GetTrackingByIdUseCase } from '../../use-cases/get-tracking-by-id.use-case';
import { Tracking } from '../../../domain/entities/tracking.entity';

@QueryHandler(GetTrackingByIdQuery)
export class GetTrackingByIdHandler
  implements IQueryHandler<GetTrackingByIdQuery>
{
  constructor(private getTrackingByIdUseCase: GetTrackingByIdUseCase) {}

  async execute(query: GetTrackingByIdQuery): Promise<Tracking> {
    return this.getTrackingByIdUseCase.execute(query.id);
  }
}
