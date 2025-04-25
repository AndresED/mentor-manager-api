import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProjectCommand } from '../../application/commands/create-project.command';
import { UpdateProjectCommand } from '../../application/commands/update-project.command';
import { DeleteProjectCommand } from '../../application/commands/delete-project.command';
import { GetProjectsQuery } from '../../application/queries/get-projects.query';
import { GetProjectByIdQuery } from '../../application/queries/get-project-by-id.query';
import { Project, ProjectStatus } from '../../domain/entities/project.entity';

@Controller('projects')
export class ProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(
    @Body()
    createProjectDto: {
      name: string;
      description: string;
      assignedDeveloper?: string;
    },
  ): Promise<Project> {
    return this.commandBus.execute(
      new CreateProjectCommand(
        createProjectDto.name,
        createProjectDto.description,
        createProjectDto.assignedDeveloper,
      ),
    );
  }

  @Get()
  async findAll(@Query('status') status?: string): Promise<Project[]> {
    return this.queryBus.execute(new GetProjectsQuery(status));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Project> {
    return this.queryBus.execute(new GetProjectByIdQuery(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateProjectDto: {
      name?: string;
      description?: string;
      status?: string;
      assignedDeveloper?: string;
    },
  ): Promise<Project> {
    return this.commandBus.execute(
      new UpdateProjectCommand(
        id,
        updateProjectDto.name,
        updateProjectDto.description,
        updateProjectDto.status as unknown as ProjectStatus,
        updateProjectDto.assignedDeveloper,
      ),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.commandBus.execute(new DeleteProjectCommand(id));
  }
}
