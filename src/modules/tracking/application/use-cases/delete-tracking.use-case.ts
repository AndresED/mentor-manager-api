import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ITrackingRepository } from '../../domain/repositories/tracking.repository.interface';

@Injectable()
export class DeleteTrackingUseCase {
  constructor(
    @Inject('ITrackingRepository')
    private trackingRepository: ITrackingRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    const tracking = await this.trackingRepository.findById(id);

    if (!tracking) {
      throw new NotFoundException(`Tracking with ID ${id} not found`);
    }

    return this.trackingRepository.delete(id);
  }
}
