import { CreateUserCommand } from '../../../application/commands/create-user.command';

describe('CreateUserCommand', () => {
  it('should create a command instance', () => {
    const command = new CreateUserCommand(
      'test@test.com',
      'Test User',
      'password',
    );

    expect(command.email).toBe('test@test.com');
    expect(command.name).toBe('Test User');
    expect(command.password).toBe('password');
  });
});
