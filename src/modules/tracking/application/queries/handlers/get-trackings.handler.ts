import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTrackingsQuery } from '../get-trackings.query';
import { GetTrackingsUseCase } from '../../use-cases/get-trackings.use-case';
import { Tracking } from '../../../domain/entities/tracking.entity';

@QueryHandler(GetTrackingsQuery)
export class GetTrackingsHandler implements IQueryHandler<GetTrackingsQuery> {
  constructor(private getTrackingsUseCase: GetTrackingsUseCase) {}

  async execute(query: GetTrackingsQuery): Promise<Tracking[]> {
    return this.getTrackingsUseCase.execute(query.projectId, query.status);
  }
}
