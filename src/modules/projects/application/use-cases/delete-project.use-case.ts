import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';

@Injectable()
export class DeleteProjectUseCase {
  constructor(
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return this.projectRepository.delete(id);
  }
}
