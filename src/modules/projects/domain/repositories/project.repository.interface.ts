import { Project } from '../entities/project.entity';

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  findByStatus(status: string): Promise<Project[]>;
  create(project: Partial<Project>): Promise<Project>;
  update(id: string, project: Partial<Project>): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
}
