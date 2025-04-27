import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { ICreateUserUseCase } from '../../use-cases/commands/ports/create-user.use-case.interface';
import { UserEntity } from '../../../domain/entities/user.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly createUserUseCase: ICreateUserUseCase) {}

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    return await this.createUserUseCase.execute(
      command.email,
      command.name,
      command.password,
    );
  }
}
