import { TrackingStatus } from '../../domain/entities/tracking.entity';

export class UpdateTrackingCommand {
  constructor(
    public readonly id: string,
    public readonly status?: TrackingStatus,
    public readonly completedObjectives?: string,
    public readonly pendingObjectives?: string,
    public readonly incidents?: string,
    public readonly observations?: string,
    public readonly nextObjectives?: string,
    public readonly coffeeBreaks?: boolean,
    public readonly notesCoffeeBreaks?: string,
    public readonly codeReviews?: boolean,
    public readonly notesCodeReviews?: string,
    public readonly pairProgramming?: boolean,
    public readonly notesPairProgramming?: string,
    public readonly weeklyMeetings?: boolean,
    public readonly notesWeeklyMeetings?: string,
  ) {}
}
