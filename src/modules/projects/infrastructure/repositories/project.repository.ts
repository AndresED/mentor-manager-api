import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../../domain/entities/project.entity';
import { IProjectRepository } from '../../domain/repositories/project.repository.interface';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  async findById(id: string): Promise<Project | null> {
    return this.projectModel.findById(id).exec();
  }

  async findByStatus(status: string): Promise<Project[]> {
    return this.projectModel.find({ status }).exec();
  }

  async create(project: Partial<Project>): Promise<Project> {
    const newProject = new this.projectModel(project);
    return newProject.save();
  }

  async update(id: string, project: Partial<Project>): Promise<Project | null> {
    return this.projectModel
      .findByIdAndUpdate(id, project, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.projectModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
