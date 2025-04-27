import { User } from '../../schemas/user.schema';

export abstract class IUserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract save(user: Partial<User>): Promise<User>;
  abstract update(id: string, data: Partial<User>): Promise<User | null>;
  abstract delete(id: string): Promise<void>;
}
