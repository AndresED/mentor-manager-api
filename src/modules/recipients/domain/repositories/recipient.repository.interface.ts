import { Recipient } from '../entities/recipient.entity';

export interface IRecipientRepository {
  findAll(): Promise<Recipient[]>;
  findById(id: string): Promise<Recipient | null>;
  create(recipient: Partial<Recipient>): Promise<Recipient>;
  update(id: string, recipient: Partial<Recipient>): Promise<Recipient | null>;
  delete(id: string): Promise<boolean>;
}
