import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IRecipientRepository } from '../../domain/repositories/recipient.repository.interface';
import { Recipient } from '../../domain/entities/recipient.entity';

@Injectable()
export class UpdateRecipientUseCase {
  constructor(
    @Inject('IRecipientRepository')
    private recipientRepository: IRecipientRepository,
  ) {}

  async execute(id: string, data: Partial<Recipient>): Promise<Recipient> {
    const recipient = await this.recipientRepository.findById(id);

    if (!recipient) {
      throw new NotFoundException(`Recipient with ID ${id} not found`);
    }

    const updatedRecipient = await this.recipientRepository.update(id, data);
    if (!updatedRecipient) {
      throw new NotFoundException(`Failed to update recipient with ID ${id}`);
    }

    return updatedRecipient;
  }
}
