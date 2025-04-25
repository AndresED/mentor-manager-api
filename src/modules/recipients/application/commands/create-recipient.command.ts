export class CreateRecipientCommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly role: string,
  ) {}
}
