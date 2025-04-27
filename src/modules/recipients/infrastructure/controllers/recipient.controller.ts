import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateRecipientCommand } from '../../application/commands/create-recipient.command';
import { UpdateRecipientCommand } from '../../application/commands/update-recipient.command';
import { DeleteRecipientCommand } from '../../application/commands/delete-recipient.command';
import { GetRecipientsQuery } from '../../application/queries/get-recipients.query';
import { GetRecipientByIdQuery } from '../../application/queries/get-recipient-by-id.query';
import { Recipient } from '../../domain/entities/recipient.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { TokenRevocationGuard } from '../../../auth/infrastructure/guards/token-revocation.guard';
import { SwaggerApiErrorResponses } from '../../../../shared/infrastructure/decorators/swagger-api-error-responses.decorator';

@Controller('recipients')
@SwaggerApiErrorResponses()
export class RecipientController {
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
    createRecipientDto: {
      name: string;
      email: string;
      role: string;
      projects: string[];
    },
  ): Promise<Recipient> {
    console.log('createRecipientDto', createRecipientDto);
    return this.commandBus.execute(
      new CreateRecipientCommand(
        createRecipientDto.name,
        createRecipientDto.email,
        createRecipientDto.role,
        createRecipientDto.projects,
      ),
    );
  }

  @Get()
  @ApiBearerAuth('Authorization')
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard('jwt'), TokenRevocationGuard)
  async findAll(): Promise<Recipient[]> {
    return this.queryBus.execute(new GetRecipientsQuery());
  }

  @Get(':id')
  @ApiBearerAuth('Authorization')
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard('jwt'), TokenRevocationGuard)
  async findOne(@Param('id') id: string): Promise<Recipient> {
    return this.queryBus.execute(new GetRecipientByIdQuery(id));
  }

  @Put(':id')
  @ApiBearerAuth('Authorization')
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard('jwt'), TokenRevocationGuard)
  async update(
    @Param('id') id: string,
    @Body()
    updateRecipientDto: {
      name?: string;
      email?: string;
      role?: string;
      projects?: string[];
    },
  ): Promise<Recipient> {
    return this.commandBus.execute(
      new UpdateRecipientCommand(
        id,
        updateRecipientDto.name,
        updateRecipientDto.email,
        updateRecipientDto.role,
      ),
    );
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard('jwt'), TokenRevocationGuard)
  async remove(@Param('id') id: string): Promise<boolean> {
    return this.commandBus.execute(new DeleteRecipientCommand(id));
  }
}
