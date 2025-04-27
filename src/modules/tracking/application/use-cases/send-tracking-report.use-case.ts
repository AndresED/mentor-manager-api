import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ITrackingRepository } from '../../domain/repositories/tracking.repository.interface';
import { EmailService } from '../../../../shared/infrastructure/services/email.service';
import { IProjectRepository } from '../../../projects/domain/repositories/project.repository.interface';
import { IRecipientRepository } from '../../../recipients/domain/repositories/recipient.repository.interface';
import { Types } from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

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
    try {
      // Obtener el tracking
      const tracking = await this.trackingRepository.findById(trackingId);
      if (!tracking) {
        throw new NotFoundException(`Tracking with ID ${trackingId} not found`);
      }

      // Convertir projectId a string
      const projectIdString = this.getProjectIdString(tracking.projectId);

      // Obtener el proyecto
      const project = await this.projectRepository.findById(projectIdString);
      if (!project) {
        throw new NotFoundException(
          `Project with ID ${projectIdString} not found`,
        );
      }

      // Obtener todos los recipients que están asociados al proyecto
      const recipients = await this.recipientRepository.findAll();
      const projectRecipients = recipients.filter((recipient) =>
        recipient.projects?.includes(projectIdString),
      );

      if (projectRecipients.length === 0) {
        throw new NotFoundException(
          `No recipients found for project ${projectIdString}`,
        );
      }

      // Obtener los emails de los recipients
      const recipientEmails = projectRecipients.map(
        (recipient) => recipient.email,
      );

      // Formatear las fechas
      const startDate = new Date(tracking.startDate).toLocaleDateString(
        'es-ES',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        },
      );
      const endDate = new Date(tracking.endDate).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });

      // Preparar los parámetros del template
      const templateParams = {
        developer: project.assignedDeveloper,
        projectName: project.name,
        startDate,
        endDate,
        completedObjectives: this.formatContent(tracking.completedObjectives),
        pendingObjectives: this.formatContent(tracking.pendingObjectives),
        nextObjectives: this.formatContent(tracking.nextObjectives),
        incidents: this.formatContent(tracking.incidents),
        observations: this.formatContent(tracking.observations),
        coffeeBreaks: tracking.coffeeBreaks ? 'Sí' : 'No',
        notesCoffeeBreaks: this.formatContent(tracking.notesCoffeeBreaks),
        codeReviews: tracking.codeReviews ? 'Sí' : 'No',
        notesCodeReviews: this.formatContent(tracking.notesCodeReviews),
        pairProgramming: tracking.pairProgramming ? 'Sí' : 'No',
        notesPairProgramming: this.formatContent(tracking.notesPairProgramming),
        weeklyMeetings: tracking.weeklyMeetings ? 'Sí' : 'No',
        notesWeeklyMeetings: this.formatContent(tracking.notesWeeklyMeetings),
      };

      // Enviar el email usando el servicio
      const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID ?? '';
      await this.emailService.sendEmail(
        TEMPLATE_ID,
        templateParams,
        recipientEmails,
      );

      // Marcar el tracking como enviado
      await this.trackingRepository.update(trackingId, { reportSent: true });

      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  private getProjectIdString(projectId: any): string {
    try {
      if (projectId instanceof Types.ObjectId) {
        return projectId.toHexString();
      }
      if (typeof projectId === 'object' && projectId !== null) {
        const objId = projectId as {
          _id?: { toString(): string };
          id?: { toString(): string };
        };
        const idString = objId._id?.toString() ?? objId.id?.toString();
        if (!idString) {
          throw new Error('Invalid project ID format');
        }
        return idString;
      }
      return String(projectId);
    } catch (error) {
      throw new Error(error);
    }
  }

  private formatContent(content: string | null | undefined): string {
    if (!content) return 'No hay información registrada';
    // Decodificar entidades HTML y mantener el formato
    return content
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
  }
}
