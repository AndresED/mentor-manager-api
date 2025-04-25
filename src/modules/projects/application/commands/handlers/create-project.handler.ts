import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProjectCommand } from '../create-project.command';
import { CreateProjectUseCase } from '../../use-cases/create-project.use-case';
import { Project } from '../../../domain/entities/project.entity';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(private readonly createProjectUseCase: CreateProjectUseCase) {}

  async execute(command: CreateProjectCommand): Promise<Project> {
    const { name, description, assignedDeveloper } = command;
    return this.createProjectUseCase.execute(
      name,
      description,
      assignedDeveloper,
    );
  }
}
