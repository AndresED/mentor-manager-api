import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Recipient,
  RecipientDocument,
} from '../../domain/entities/recipient.entity';
import { IRecipientRepository } from '../../domain/repositories/recipient.repository.interface';

@Injectable()
export class RecipientRepository implements IRecipientRepository {
  constructor(
    @InjectModel(Recipient.name)
    private recipientModel: Model<RecipientDocument>,
  ) {}

  async findAll(): Promise<Recipient[]> {
    return this.recipientModel.find().exec();
  }

  async findById(id: string): Promise<Recipient | null> {
    return this.recipientModel.findById(id).exec();
  }

  async create(recipient: Partial<Recipient>): Promise<Recipient> {
    const newRecipient = new this.recipientModel(recipient);
    return newRecipient.save();
  }

  async update(
    id: string,
    recipient: Partial<Recipient>,
  ): Promise<Recipient | null> {
    return this.recipientModel
      .findByIdAndUpdate(id, recipient, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.recipientModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
