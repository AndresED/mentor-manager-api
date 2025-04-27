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
import { CreateTrackingCommand } from '../../application/commands/create-tracking.command';
import { UpdateTrackingCommand } from '../../application/commands/update-tracking.command';
import { DeleteTrackingCommand } from '../../application/commands/delete-tracking.command';
import { SendTrackingReportCommand } from '../../application/commands/send-tracking-report.command';
import { GetTrackingsQuery } from '../../application/queries/get-trackings.query';
import { GetTrackingByIdQuery } from '../../application/queries/get-tracking-by-id.query';
import {
  Tracking,
  TrackingStatus,
} from '../../domain/entities/tracking.entity';

@Controller('trackings')
export class TrackingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(
    @Body()
    createTrackingDto: {
      projectId: string;
      startDate: Date;
      endDate: Date;
      developer: string;
    },
  ): Promise<Tracking> {
    return this.commandBus.execute(
      new CreateTrackingCommand(
        createTrackingDto.projectId,
        createTrackingDto.startDate,
        createTrackingDto.endDate,
        createTrackingDto.developer,
      ),
    );
  }

  @Get()
  async findAll(
    @Query('projectId') projectId?: string,
    @Query('status') status?: string,
  ): Promise<Tracking[]> {
    return this.queryBus.execute(new GetTrackingsQuery(projectId, status));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Tracking> {
    return this.queryBus.execute(new GetTrackingByIdQuery(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateTrackingDto: {
      status?: string;
      completedObjectives?: string;
      pendingObjectives?: string;
      incidents?: string;
      observations?: string;
      nextObjectives?: string;
      coffeeBreaks?: boolean;
      notesCoffeeBreaks?: string;
      codeReviews?: boolean;
      notesCodeReviews?: string;
      pairProgramming?: boolean;
      notesPairProgramming?: string;
    },
  ): Promise<Tracking> {
    return this.commandBus.execute(
      new UpdateTrackingCommand(
        id,
        updateTrackingDto.status as TrackingStatus | undefined,
        updateTrackingDto.completedObjectives,
        updateTrackingDto.pendingObjectives,
        updateTrackingDto.incidents,
        updateTrackingDto.observations,
        updateTrackingDto.nextObjectives,
        updateTrackingDto.coffeeBreaks,
        updateTrackingDto.notesCoffeeBreaks,
        updateTrackingDto.codeReviews,
        updateTrackingDto.notesCodeReviews,
        updateTrackingDto.pairProgramming,
        updateTrackingDto.notesPairProgramming,
      ),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.commandBus.execute(new DeleteTrackingCommand(id));
  }

  @Post(':id/send-report')
  async sendReport(@Param('id') id: string): Promise<boolean> {
    return this.commandBus.execute(new SendTrackingReportCommand(id));
  }
}
