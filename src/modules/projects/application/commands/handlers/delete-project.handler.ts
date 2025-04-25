import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProjectCommand } from '../delete-project.command';
import { DeleteProjectUseCase } from '../../use-cases/delete-project.use-case';

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler
  implements ICommandHandler<DeleteProjectCommand>
{
  constructor(private readonly deleteProjectUseCase: DeleteProjectUseCase) {}

  async execute(command: DeleteProjectCommand): Promise<boolean> {
    return this.deleteProjectUseCase.execute(command.id);
  }
}
