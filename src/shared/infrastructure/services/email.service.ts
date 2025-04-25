import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Tracking } from '../../../modules/tracking/domain/entities/tracking.entity';
import { Project } from '../../../modules/projects/domain/entities/project.entity';
import { Recipient } from '../../../modules/recipients/domain/entities/recipient.entity';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendTrackingReport(
    tracking: Tracking,
    project: Project,
    recipients: Recipient[],
  ): Promise<boolean> {
    // Aquí implementarías la lógica para enviar el correo
    // Puedes usar SendGrid, Nodemailer u otro servicio de email

    console.log(`Sending tracking report for ${project.name}`);
    console.log(`Tracking: ${tracking.name}`);
    console.log(`Recipients: ${recipients.map((r) => r.email).join(', ')}`);

    // Por ahora, simulamos que el envío fue exitoso
    return true;
  }
}
