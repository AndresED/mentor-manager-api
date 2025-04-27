import { UserEntity } from '../entities/user.entity';

export abstract class IUserRepositoryDomain {
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findAll(): Promise<UserEntity[]>;
  abstract save(user: Partial<UserEntity>): Promise<UserEntity>;
  abstract update(
    id: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity | null>;
  abstract delete(id: string): Promise<void>;
}
