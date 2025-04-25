export class GetTrackingsQuery {
  constructor(
    public readonly projectId?: string,
    public readonly status?: string,
  ) {}
}
