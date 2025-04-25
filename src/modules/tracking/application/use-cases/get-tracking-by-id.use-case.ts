import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ITrackingRepository } from '../../domain/repositories/tracking.repository.interface';
import { Tracking } from '../../domain/entities/tracking.entity';

@Injectable()
export class GetTrackingByIdUseCase {
  constructor(
    @Inject('ITrackingRepository')
    private trackingRepository: ITrackingRepository,
  ) {}

  async execute(id: string): Promise<Tracking> {
    const tracking = await this.trackingRepository.findById(id);

    if (!tracking) {
      throw new NotFoundException(`Tracking with ID ${id} not found`);
    }

    return tracking;
  }
}
