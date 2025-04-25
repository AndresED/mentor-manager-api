import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProjectsQuery } from '../get-projects.query';
import { GetProjectsUseCase } from '../../use-cases/get-projects.use-case';
import { Project } from '../../../domain/entities/project.entity';

@QueryHandler(GetProjectsQuery)
export class GetProjectsHandler implements IQueryHandler<GetProjectsQuery> {
  constructor(private getProjectsUseCase: GetProjectsUseCase) {}

  async execute(query: GetProjectsQuery): Promise<Project[]> {
    return this.getProjectsUseCase.execute(query.status);
  }
}
