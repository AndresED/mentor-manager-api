import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './domain/entities/project.entity';
import { ProjectRepository } from './infrastructure/repositories/project.repository';
import { ProjectController } from './infrastructure/controllers/project.controller';
import { CreateProjectUseCase } from './application/use-cases/create-project.use-case';
import { UpdateProjectUseCase } from './application/use-cases/update-project.use-case';
import { DeleteProjectUseCase } from './application/use-cases/delete-project.use-case';
import { GetProjectsUseCase } from './application/use-cases/get-projects.use-case';
import { GetProjectByIdUseCase } from './application/use-cases/get-project-by-id.use-case';
import { CreateProjectHandler } from './application/commands/handlers/create-project.handler';
import { UpdateProjectHandler } from './application/commands/handlers/update-project.handler';
import { DeleteProjectHandler } from './application/commands/handlers/delete-project.handler';
import { GetProjectsHandler } from './application/queries/handlers/get-projects.handler';
import { GetProjectByIdHandler } from './application/queries/handlers/get-project-by-id.handler';

const CommandHandlers = [
  CreateProjectHandler,
  UpdateProjectHandler,
  DeleteProjectHandler,
];

const QueryHandlers = [GetProjectsHandler, GetProjectByIdHandler];

const UseCases = [
  CreateProjectUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
  GetProjectsUseCase,
  GetProjectByIdUseCase,
];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
  ],
  controllers: [ProjectController],
  providers: [
    { provide: 'IProjectRepository', useClass: ProjectRepository },
    ...UseCases,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [{ provide: 'IProjectRepository', useClass: ProjectRepository }],
})
export class ProjectsModule {}
