import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenRepository } from '../../../infrastructure/repositories/token.repository';
import { TokenEntity } from '../../../domain/entities/token.entity';
import { Token } from '../../../infrastructure/schemas/token.schema';

// Mock the TokenEntity class to avoid validation issues
jest.mock('../../../domain/entities/token.entity', () => {
  return {
    TokenEntity: jest.fn().mockImplementation((data) => {
      return {
        _id: data._id,
        userId: data.userId,
        token: data.token,
        type: data.type,
        expiresAt: data.expiresAt,
        createdAt: data.createdAt,
      };
    }),
  };
});

describe('TokenRepository', () => {
  let repository: TokenRepository;
  let tokenModel: Model<Token>;

  // Set expiration date to 1 hour in the future
  const futureDate = new Date(Date.now() + 3600000);

  const mockToken = {
    _id: '507f1f77bcf86cd799439011',
    userId: 'user123',
    token: 'token123',
    type: 'access',
    expiresAt: futureDate,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const mockModelFactory = function () {
      this.save = jest.fn().mockResolvedValue(mockToken);
    };

    mockModelFactory.prototype.save = jest.fn().mockResolvedValue(mockToken);
    mockModelFactory.find = jest.fn().mockReturnThis();
    mockModelFactory.findOne = jest.fn().mockReturnThis();
    mockModelFactory.deleteOne = jest.fn().mockReturnThis();
    mockModelFactory.deleteMany = jest.fn().mockReturnThis();
    mockModelFactory.exec = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [
        TokenRepository,
        {
          provide: getModelToken(Token.name),
          useValue: mockModelFactory,
        },
      ],
    }).compile();

    repository = moduleRef.get<TokenRepository>(TokenRepository);
    tokenModel = moduleRef.get<Model<Token>>(getModelToken(Token.name));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a token entity', async () => {
      const mockTokenEntity = new TokenEntity({
        _id: '507f1f77bcf86cd799439011',
        userId: 'user123',
        token: 'token123',
        type: 'access',
        expiresAt: futureDate,
        createdAt: mockToken.createdAt,
      });

      const result = await repository.save(mockTokenEntity);

      expect(result.userId).toEqual(mockTokenEntity.userId);
      expect(result.token).toEqual(mockTokenEntity.token);
      expect(result.type).toEqual(mockTokenEntity.type);
    });
  });

  describe('findByToken', () => {
    it('should find a token by token string', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(mockToken);
      jest.spyOn(tokenModel, 'findOne').mockReturnValueOnce({
        exec: execMock,
      } as any);

      const result = await repository.findByToken('token123');

      expect(tokenModel.findOne).toHaveBeenCalledWith({ token: 'token123' });
      expect(execMock).toHaveBeenCalled();
      expect(result?.token).toEqual('token123');
    });

    it('should return null if token is not found', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(null);
      jest.spyOn(tokenModel, 'findOne').mockReturnValueOnce({
        exec: execMock,
      } as any);

      const result = await repository.findByToken('nonexistent');

      expect(tokenModel.findOne).toHaveBeenCalledWith({ token: 'nonexistent' });
      expect(execMock).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find tokens by user ID', async () => {
      const mockTokens = [mockToken, { ...mockToken, token: 'token456' }];
      const execMock = jest.fn().mockResolvedValueOnce(mockTokens);
      jest.spyOn(tokenModel, 'find').mockReturnValueOnce({
        exec: execMock,
      } as any);

      const result = await repository.findByUserId('user123');

      expect(tokenModel.find).toHaveBeenCalledWith({ userId: 'user123' });
      expect(execMock).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].userId).toEqual('user123');
    });

    it('should return empty array if no tokens found', async () => {
      const execMock = jest.fn().mockResolvedValueOnce([]);
      jest.spyOn(tokenModel, 'find').mockReturnValueOnce({
        exec: execMock,
      } as any);

      const result = await repository.findByUserId('nonexistent');

      expect(tokenModel.find).toHaveBeenCalledWith({ userId: 'nonexistent' });
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('deleteByToken', () => {
    it('should delete a token by token string', async () => {
      const execMock = jest.fn().mockResolvedValueOnce({ deletedCount: 1 });
      jest.spyOn(tokenModel, 'deleteOne').mockReturnValueOnce({
        exec: execMock,
      } as any);

      await repository.deleteByToken('token123');

      expect(tokenModel.deleteOne).toHaveBeenCalledWith({ token: 'token123' });
      expect(execMock).toHaveBeenCalled();
    });
  });

  describe('deleteByUserId', () => {
    it('should delete tokens by user ID', async () => {
      const execMock = jest.fn().mockResolvedValueOnce({ deletedCount: 2 });
      jest.spyOn(tokenModel, 'deleteMany').mockReturnValueOnce({
        exec: execMock,
      } as any);

      await repository.deleteByUserId('user123');

      expect(tokenModel.deleteMany).toHaveBeenCalledWith({ userId: 'user123' });
      expect(execMock).toHaveBeenCalled();
    });
  });

  describe('toEntity', () => {
    it('should convert a model to an entity', () => {
      const result = (repository as any).toEntity(mockToken);

      expect(result._id).toEqual(mockToken._id);
      expect(result.userId).toEqual(mockToken.userId);
      expect(result.token).toEqual(mockToken.token);
      expect(result.type).toEqual(mockToken.type);
      expect(result.expiresAt).toEqual(mockToken.expiresAt);
      expect(result.createdAt).toEqual(mockToken.createdAt);
    });

    it('should handle model with id instead of _id', () => {
      const mockTokenWithId = {
        id: '507f1f77bcf86cd799439011',
        userId: 'user123',
        token: 'token123',
        type: 'access',
        expiresAt: futureDate,
        createdAt: new Date(),
      };

      const result = (repository as any).toEntity(mockTokenWithId);

      expect(result._id).toEqual(mockTokenWithId.id);
    });
  });
});
