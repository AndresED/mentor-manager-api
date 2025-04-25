import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Tracking,
  TrackingDocument,
} from '../../domain/entities/tracking.entity';
import { ITrackingRepository } from '../../domain/repositories/tracking.repository.interface';

@Injectable()
export class TrackingRepository implements ITrackingRepository {
  constructor(
    @InjectModel(Tracking.name)
    private readonly trackingModel: Model<TrackingDocument>,
  ) {}

  async findAll(): Promise<Tracking[]> {
    return this.trackingModel.find().exec();
  }

  async findById(id: string): Promise<Tracking | null> {
    return this.trackingModel.findById(id).exec();
  }

  async findByProjectId(projectId: string): Promise<Tracking[]> {
    return this.trackingModel
      .find({
        projectId: new Types.ObjectId(projectId),
      })
      .exec();
  }

  async findByStatus(status: string): Promise<Tracking[]> {
    return this.trackingModel.find({ status }).exec();
  }

  async create(tracking: Partial<Tracking>): Promise<Tracking> {
    const newTracking = new this.trackingModel(tracking);
    return newTracking.save();
  }

  async update(
    id: string,
    tracking: Partial<Tracking>,
  ): Promise<Tracking | null> {
    return this.trackingModel
      .findByIdAndUpdate(id, tracking, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.trackingModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
