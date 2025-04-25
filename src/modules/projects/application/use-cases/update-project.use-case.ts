import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';
import { Project } from '../../domain/entities/project.entity';

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject('IProjectRepository') private projectRepository: IProjectRepository,
  ) {}

  async execute(id: string, data: Partial<Project>): Promise<Project> {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const updatedProject = await this.projectRepository.update(id, data);
    if (!updatedProject) {
      throw new NotFoundException(`Failed to update project with ID ${id}`);
    }

    return updatedProject;
  }
}
