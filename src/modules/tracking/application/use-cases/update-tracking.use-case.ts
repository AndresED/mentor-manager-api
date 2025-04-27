import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ITrackingRepository } from '../../domain/repositories/tracking.repository.interface';
import { Tracking } from '../../domain/entities/tracking.entity';

@Injectable()
export class UpdateTrackingUseCase {
  constructor(
    @Inject('ITrackingRepository')
    private readonly trackingRepository: ITrackingRepository,
  ) {}

  async execute(id: string, data: Partial<Tracking>): Promise<Tracking> {
    const tracking = await this.trackingRepository.findById(id);

    if (!tracking) {
      throw new NotFoundException(`Tracking with ID ${id} not found`);
    }

    const updatedTracking = await this.trackingRepository.update(id, data);
    if (!updatedTracking) {
      throw new NotFoundException(`Failed to update tracking with ID ${id}`);
    }

    return updatedTracking;
  }
}
