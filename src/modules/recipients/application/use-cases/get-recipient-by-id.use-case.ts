import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IRecipientRepository } from '../../domain/repositories/recipient.repository.interface';
import { Recipient } from '../../domain/entities/recipient.entity';

@Injectable()
export class GetRecipientByIdUseCase {
  constructor(
    @Inject('IRecipientRepository')
    private recipientRepository: IRecipientRepository,
  ) {}

  async execute(id: string): Promise<Recipient> {
    const recipient = await this.recipientRepository.findById(id);

    if (!recipient) {
      throw new NotFoundException(`Recipient with ID ${id} not found`);
    }

    return recipient;
  }
}
