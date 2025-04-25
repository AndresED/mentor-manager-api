export class CreateTrackingCommand {
  constructor(
    public readonly projectId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly developer: string,
  ) {}
}
