import { UpdateUserCommand } from '../../../application/commands/update-user.command';

describe('UpdateUserCommand', () => {
  it('should create a command instance', () => {
    const updateData = { name: 'Updated Name' };
    const command = new UpdateUserCommand('user-id', updateData);

    expect(command.id).toBe('user-id');
    expect(command.updateData).toEqual(updateData);
  });
});
