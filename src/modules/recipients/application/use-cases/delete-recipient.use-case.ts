import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IRecipientRepository } from '../../domain/repositories/recipient.repository.interface';

@Injectable()
export class DeleteRecipientUseCase {
  constructor(
    @Inject('IRecipientRepository')
    private recipientRepository: IRecipientRepository,
  ) {}

  async execute(id: string): Promise<boolean> {
    const recipient = await this.recipientRepository.findById(id);

    if (!recipient) {
      throw new NotFoundException(`Recipient with ID ${id} not found`);
    }

    return this.recipientRepository.delete(id);
  }
}
