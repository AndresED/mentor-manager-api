import { Injectable, Inject } from '@nestjs/common';
import { ITrackingRepository } from '../../domain/repositories/tracking.repository.interface';
import { Tracking } from '../../domain/entities/tracking.entity';

@Injectable()
export class GetTrackingsUseCase {
  constructor(
    @Inject('ITrackingRepository')
    private trackingRepository: ITrackingRepository,
  ) {}

  async execute(projectId?: string, status?: string): Promise<Tracking[]> {
    if (projectId) {
      return this.trackingRepository.findByProjectId(projectId);
    }
    if (status) {
      return this.trackingRepository.findByStatus(status);
    }
    return this.trackingRepository.findAll();
  }
}
