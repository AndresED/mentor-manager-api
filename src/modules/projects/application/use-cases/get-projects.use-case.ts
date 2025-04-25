import { Injectable, Inject } from '@nestjs/common';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';
import { Project } from '../../domain/entities/project.entity';

@Injectable()
export class GetProjectsUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(status?: string): Promise<Project[]> {
    if (status) {
      return this.projectRepository.findByStatus(status);
    }
    return this.projectRepository.findAll();
  }
}
