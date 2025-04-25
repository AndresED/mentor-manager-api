import { ProjectStatus } from '../../domain/entities/project.entity';

export class UpdateProjectCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly status?: ProjectStatus,
    public readonly assignedDeveloper?: string,
  ) {}
}
