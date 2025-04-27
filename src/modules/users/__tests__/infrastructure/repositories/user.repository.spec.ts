import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { User } from '../../../infrastructure/schemas/user.schema';
import { UserEntity } from '../../../domain/entities/user.entity';

// Mock the UserEntity class to avoid validation issues
jest.mock('../../../domain/entities/user.entity', () => {
  return {
    UserEntity: jest.fn().mockImplementation((data) => {
      return {
        ...data,
      };
    }),
  };
});

describe('UserRepository', () => {
  let repository: UserRepository;
  let userModel: Model<User>;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    // Create a constructor function for the mock model
    function MockModel(data: any) {
      Object.assign(this, data);
      this.save = jest.fn().mockResolvedValue({ _id: mockUser._id, ...data });
    }

    // Add static methods to the constructor
    MockModel.findOne = jest.fn().mockReturnThis();
    MockModel.findById = jest.fn().mockReturnThis();
    MockModel.find = jest.fn().mockReturnThis();
    MockModel.findByIdAndUpdate = jest.fn().mockReturnThis();
    MockModel.findByIdAndDelete = jest.fn().mockReturnThis();
    MockModel.exec = jest.fn();
    MockModel.prototype.save = jest.fn().mockResolvedValue(mockUser);

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getModelToken(User.name),
          useValue: MockModel,
        },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
    userModel = moduleRef.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(mockUser);
      (userModel.findOne as jest.Mock).mockReturnValueOnce({
        exec: execMock,
      });

      const result = await repository.findByEmail('test@example.com');

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(execMock).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result?.email).toEqual(mockUser.email);
    });

    it('should return null if user is not found', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(null);
      (userModel.findOne as jest.Mock).mockReturnValueOnce({
        exec: execMock,
      });

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: 'nonexistent@example.com',
      });
      expect(execMock).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(mockUser);
      (userModel.findById as jest.Mock).mockReturnValueOnce({
        exec: execMock,
      });

      const result = await repository.findById('507f1f77bcf86cd799439011');

      expect(userModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(execMock).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result?._id).toEqual(mockUser._id);
    });

    it('should return null if user is not found', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(null);
      (userModel.findById as jest.Mock).mockReturnValueOnce({
        exec: execMock,
      });

      const result = await repository.findById('nonexistent-id');

      expect(userModel.findById).toHaveBeenCalledWith('nonexistent-id');
      expect(execMock).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [
        mockUser,
        {
          ...mockUser,
          _id: '507f1f77bcf86cd799439012',
          email: 'another@example.com',
        },
      ];
      const execMock = jest.fn().mockResolvedValueOnce(mockUsers);
      (userModel.find as jest.Mock).mockReturnValueOnce({
        exec: execMock,
      });

      const result = await repository.findAll();

      expect(userModel.find).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].email).toEqual(mockUser.email);
      expect(result[1].email).toEqual('another@example.com');
    });

    it('should return empty array if no users found', async () => {
      const execMock = jest.fn().mockResolvedValueOnce([]);
      (userModel.find as jest.Mock).mockReturnValueOnce({
        exec: execMock,
      });

      const result = await repository.findAll();

      expect(userModel.find).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('save', () => {
    it('should save a user entity', async () => {
      const userEntity = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
      };

      const result = await repository.save(userEntity as UserEntity);

      expect(result).toBeDefined();
      expect(result.email).toEqual(userEntity.email);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, ...updateData };

      const execMock = jest.fn().mockResolvedValueOnce(updatedUser);
      (userModel.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        exec: execMock,
      });

      const result = await repository.update(
        '507f1f77bcf86cd799439011',
        updateData,
      );

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateData,
        { new: true },
      );
      expect(execMock).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result?.name).toEqual(updateData.name);
    });

    it('should return null if user to update is not found', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(null);
      (userModel.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
        exec: execMock,
      });

      const result = await repository.update('nonexistent-id', {
        name: 'Updated Name',
      });

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'nonexistent-id',
        { name: 'Updated Name' },
        { new: true },
      );
      expect(execMock).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(mockUser);
      (userModel.findByIdAndDelete as jest.Mock).mockReturnValueOnce({
        exec: execMock,
      });

      await repository.delete('507f1f77bcf86cd799439011');

      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(execMock).toHaveBeenCalled();
    });
  });

  describe('toEntity', () => {
    it('should convert a model with _id to an entity', () => {
      const result = (repository as any).toEntity(mockUser);

      expect(result._id).toEqual(mockUser._id);
      expect(result.email).toEqual(mockUser.email);
      expect(result.name).toEqual(mockUser.name);
      expect(result.password).toEqual(mockUser.password);
    });

    it('should handle model with id instead of _id', () => {
      const mockUserWithId = {
        id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = (repository as any).toEntity(mockUserWithId);

      expect(result._id).toEqual(mockUserWithId.id);
      expect(result.email).toEqual(mockUserWithId.email);
    });
  });
});
