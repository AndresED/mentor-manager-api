export class CreateProjectCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly assignedDeveloper?: string,
  ) {}
}
