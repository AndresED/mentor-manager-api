import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../update-user.command';
import { IUpdateUserUseCase } from '../../use-cases/commands/ports/update-user.use-case.interface';
import { UserEntity } from '../../../domain/entities/user.entity';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly updateUserUseCase: IUpdateUserUseCase) {}

  async execute(command: UpdateUserCommand): Promise<UserEntity> {
    return await this.updateUserUseCase.execute(command.id, command.updateData);
  }
}
