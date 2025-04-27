import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProjectCommand } from '../../application/commands/create-project.command';
import { UpdateProjectCommand } from '../../application/commands/update-project.command';
import { DeleteProjectCommand } from '../../application/commands/delete-project.command';
import { GetProjectsQuery } from '../../application/queries/get-projects.query';
import { GetProjectByIdQuery } from '../../application/queries/get-project-by-id.query';
import { Project, ProjectStatus } from '../../domain/entities/project.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { TokenRevocationGuard } from '../../../auth/infrastructure/guards/token-revocation.guard';
import { SwaggerApiErrorResponses } from '../../../../shared/infrastructure/decorators/swagger-api-error-responses.decorator';

@Controller('projects')
@SwaggerApiErrorResponses()
export class ProjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiBearerAuth('Authorization')
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard('jwt'), TokenRevocationGuard)
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
  @ApiBearerAuth('Authorization')
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard('jwt'), TokenRevocationGuard)
  async findAll(@Query('status') status?: string): Promise<Project[]> {
    return this.queryBus.execute(new GetProjectsQuery(status));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Project> {
    return this.queryBus.execute(new GetProjectByIdQuery(id));
  }

  @Put(':id')
  @ApiBearerAuth('Authorization')
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard('jwt'), TokenRevocationGuard)
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
  @ApiBearerAuth('Authorization')
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard('jwt'), TokenRevocationGuard)
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.commandBus.execute(new DeleteProjectCommand(id));
  }
}
