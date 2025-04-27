import { TokenEntity } from '../entities/token.entity';

export abstract class ITokenRepositoryDomain {
  abstract save(token: TokenEntity): Promise<TokenEntity>;
  abstract findByToken(token: string): Promise<TokenEntity | null>;
  abstract findByUserId(userId: string): Promise<TokenEntity[]>;
  abstract deleteByToken(token: string): Promise<void>;
  abstract deleteByUserId(userId: string): Promise<void>;
}
