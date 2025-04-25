import { Injectable, Inject } from '@nestjs/common';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';
import { Project } from '../../domain/entities/project.entity';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(
    name: string,
    description: string,
    assignedDeveloper?: string,
  ): Promise<Project> {
    return this.projectRepository.create({
      name,
      description,
      assignedDeveloper,
    });
  }
}
