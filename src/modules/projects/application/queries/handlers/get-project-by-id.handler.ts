import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProjectByIdQuery } from '../get-project-by-id.query';
import { GetProjectByIdUseCase } from '../../use-cases/get-project-by-id.use-case';
import { Project } from '../../../domain/entities/project.entity';

@QueryHandler(GetProjectByIdQuery)
export class GetProjectByIdHandler
  implements IQueryHandler<GetProjectByIdQuery>
{
  constructor(private getProjectByIdUseCase: GetProjectByIdUseCase) {}

  async execute(query: GetProjectByIdQuery): Promise<Project> {
    return this.getProjectByIdUseCase.execute(query.id);
  }
}
