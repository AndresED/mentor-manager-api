import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../login.command';
import { ILoginUseCase } from '../../use-cases/commands/ports/login.use-case.interface';
import { LoginResponse } from '../../use-cases/commands/ports/login.use-case.interface';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(private readonly loginUseCase: ILoginUseCase) {}

  async execute(command: LoginCommand): Promise<LoginResponse> {
    return await this.loginUseCase.execute({
      email: command.email,
      password: command.password,
    });
  }
}
