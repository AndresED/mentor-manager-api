import { Tracking } from '../entities/tracking.entity';

export interface ITrackingRepository {
  findAll(): Promise<Tracking[]>;
  findById(id: string): Promise<Tracking | null>;
  findByProjectId(projectId: string): Promise<Tracking[]>;
  findByStatus(status: string): Promise<Tracking[]>;
  create(tracking: Partial<Tracking>): Promise<Tracking>;
  update(id: string, tracking: Partial<Tracking>): Promise<Tracking | null>;
  delete(id: string): Promise<boolean>;
}
