import { Injectable, Inject } from '@nestjs/common';
import { IRecipientRepository } from '../../domain/repositories/recipient.repository.interface';
import { Recipient } from '../../domain/entities/recipient.entity';

@Injectable()
export class GetRecipientsUseCase {
  constructor(
    @Inject('IRecipientRepository')
    private recipientRepository: IRecipientRepository,
  ) {}

  async execute(): Promise<Recipient[]> {
    return this.recipientRepository.findAll();
  }
}
