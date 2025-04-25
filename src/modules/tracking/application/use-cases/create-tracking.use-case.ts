import { Injectable, Inject } from '@nestjs/common';
import { ITrackingRepository } from '../../domain/repositories/tracking.repository.interface';
import { Tracking } from '../../domain/entities/tracking.entity';

@Injectable()
export class CreateTrackingUseCase {
  constructor(
    @Inject('ITrackingRepository')
    private readonly trackingRepository: ITrackingRepository,
  ) {}

  async execute(
    projectId: string,
    startDate: Date,
    endDate: Date,
    developer: string,
  ): Promise<Tracking> {
    return this.trackingRepository.create({
      projectId: projectId,
      startDate,
      endDate,
      developer,
      name: `Seguimiento ${new Date().toISOString().split('T')[0]}`,
    });
  }
}
