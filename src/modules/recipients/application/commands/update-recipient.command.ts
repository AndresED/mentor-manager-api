export class UpdateRecipientCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly role?: string,
  ) {}
}
