import { DeleteUserCommand } from '../../../application/commands/delete-user.command';

describe('DeleteUserCommand', () => {
  it('should create a command instance', () => {
    const command = new DeleteUserCommand('user-id');

    expect(command.id).toBe('user-id');
  });
});
