import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '../schemas/token.schema';
import { TokenEntity } from '../../domain/entities/token.entity';
import { ITokenRepositoryDomain } from '../../domain/repositories/token.repository.domain';

@Injectable()
export class TokenRepository implements ITokenRepositoryDomain {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  async save(tokenEntity: TokenEntity): Promise<TokenEntity> {
    const tokenData = { ...tokenEntity };
    delete tokenData._id; // Eliminamos el _id si existe para que MongoDB lo genere
    const createdToken = new this.tokenModel(tokenData);
    const savedToken = await createdToken.save();
    return this.toEntity(savedToken);
  }

  async findByToken(token: string): Promise<TokenEntity | null> {
    const foundToken = await this.tokenModel.findOne({ token }).exec();
    return foundToken ? this.toEntity(foundToken) : null;
  }

  async findByUserId(userId: string): Promise<TokenEntity[]> {
    const tokens = await this.tokenModel.find({ userId }).exec();
    return tokens.map((token) => this.toEntity(token));
  }

  async deleteByToken(token: string): Promise<void> {
    await this.tokenModel.deleteOne({ token }).exec();
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.tokenModel.deleteMany({ userId }).exec();
  }

  private toEntity(model: Token): TokenEntity {
    return new TokenEntity({
      _id: model._id?.toString() ?? model.id?.toString(),
      userId: model.userId,
      token: model.token,
      type: model.type as 'access' | 'refresh' | 'reset',
      expiresAt: model.expiresAt,
      createdAt: model.createdAt,
    });
  }
}
