import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../delete-user.command';
import { IDeleteUserUseCase } from '../../use-cases/commands/ports/delete-user.use-case.interface';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly deleteUserUseCase: IDeleteUserUseCase) {}

  async execute(command: DeleteUserCommand) {
    await this.deleteUserUseCase.execute(command.id);
    return { message: 'User deleted successfully' };
  }
}
