import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ITrackingRepository } from '../../domain/repositories/tracking.repository.interface';
import { EmailService } from '../../../../shared/infrastructure/services/email.service';
import { IProjectRepository } from '../../../projects/domain/repositories/project.repository.interface';
import { IRecipientRepository } from '../../../recipients/domain/repositories/recipient.repository.interface';
import { Types } from 'mongoose';

@Injectable()
export class SendTrackingReportUseCase {
  constructor(
    @Inject('ITrackingRepository')
    private readonly trackingRepository: ITrackingRepository,
    @Inject('IProjectRepository')
    private readonly projectRepository: IProjectRepository,
    @Inject('IRecipientRepository')
    private readonly recipientRepository: IRecipientRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(trackingId: string): Promise<boolean> {
    const tracking = await this.trackingRepository.findById(trackingId);

    if (!tracking) {
      throw new NotFoundException(`Tracking with ID ${trackingId} not found`);
    }

    // Convert to string safely
    let projectIdString: string;
    if (tracking.projectId instanceof Types.ObjectId) {
      projectIdString = tracking.projectId.toHexString();
    } else if (
      typeof tracking.projectId === 'object' &&
      tracking.projectId !== null
    ) {
      const objId = tracking.projectId as {
        _id?: { toString(): string };
        id?: { toString(): string };
      };
      const idString = objId._id?.toString() ?? objId.id?.toString();
      if (!idString) {
        throw new Error('Invalid project ID format');
      }
      projectIdString = idString;
    } else {
      projectIdString = String(tracking.projectId);
    }

    const project = await this.projectRepository.findById(projectIdString);

    if (!project) {
      throw new NotFoundException(
        `Project with ID ${projectIdString} not found`,
      );
    }

    const recipients = await this.recipientRepository.findAll();

    if (recipients.length === 0) {
      throw new NotFoundException('No recipients found to send the report');
    }

    await this.emailService.sendTrackingReport(tracking, project, recipients);

    await this.trackingRepository.update(trackingId, { reportSent: true });

    return true;
  }
}
