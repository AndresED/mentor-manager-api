import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProjectCommand } from '../update-project.command';
import { UpdateProjectUseCase } from '../../use-cases/update-project.use-case';
import {
  Project,
  ProjectStatus,
} from '../../../domain/entities/project.entity';

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler
  implements ICommandHandler<UpdateProjectCommand>
{
  constructor(private readonly updateProjectUseCase: UpdateProjectUseCase) {}

  async execute(command: UpdateProjectCommand): Promise<Project> {
    const { id, ...commandData } = command;

    // Convertir el status de string a enum si existe
    const data: Partial<Project> = { ...commandData };
    if (commandData.status) {
      // Use type assertion to convert string to ProjectStatus enum
      data.status = commandData.status as ProjectStatus;
    }

    return this.updateProjectUseCase.execute(id, data);
  }
}
