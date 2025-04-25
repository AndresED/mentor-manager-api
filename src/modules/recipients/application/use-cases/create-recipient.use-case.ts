import { Injectable, Inject } from '@nestjs/common';
import { IRecipientRepository } from '../../domain/repositories/recipient.repository.interface';
import { Recipient } from '../../domain/entities/recipient.entity';

@Injectable()
export class CreateRecipientUseCase {
  constructor(
    @Inject('IRecipientRepository')
    private recipientRepository: IRecipientRepository,
  ) {}

  async execute(name: string, email: string, role: string): Promise<Recipient> {
    return this.recipientRepository.create({
      name,
      email,
      role,
    });
  }
}
