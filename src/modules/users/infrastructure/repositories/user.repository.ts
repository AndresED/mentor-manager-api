import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepositoryDomain } from '../../domain/repositories/user.repository.domain';
import { User } from '../schemas/user.schema';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepositoryDomain {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;
    return this.toEntity(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this.toEntity(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => this.toEntity(user));
  }

  async save(userEntity: UserEntity): Promise<UserEntity> {
    const { _id, ...userData } = userEntity;
    const createdUser = new this.userModel(userData);
    const savedUser = await createdUser.save();
    return this.toEntity(savedUser);
  }

  async update(
    id: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity | null> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!updatedUser) return null;
    return this.toEntity(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  private toEntity(model: User): UserEntity {
    return new UserEntity({
      _id: model._id?.toString() ?? model.id?.toString(),
      email: model.email,
      name: model.name,
      password: model.password,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
