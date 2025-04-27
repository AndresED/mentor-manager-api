import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { GetUsersQuery } from '../../application/queries/get-users.query';
import { GetUserByIdQuery } from '../../application/queries/get-user-by-id.query';
import { UpdateUserCommand } from '../../application/commands/update-user.command';
import { DeleteUserCommand } from '../../application/commands/delete-user.command';
import { AuthGuard } from '@nestjs/passport';
import { SwaggerApiErrorResponses } from '../../../../shared/infrastructure/decorators/swagger-api-error-responses.decorator';
import { TokenRevocationGuard } from '../../../auth/infrastructure/guards/token-revocation.guard';
@SwaggerApiErrorResponses()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.commandBus.execute(
      new CreateUserCommand(
        createUserDto.email,
        createUserDto.name,
        createUserDto.password,
      ),
    );
  }

  @Get()
  @ApiBearerAuth('Authorization')
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard('jwt'), TokenRevocationGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  async getUsers() {
    return await this.queryBus.execute(new GetUsersQuery());
  }

  @Get(':id')
  @ApiBearerAuth('Authorization')
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard('jwt'), TokenRevocationGuard)
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'Return user by id' })
  async getUserById(@Param('id') id: string) {
    return await this.queryBus.execute(new GetUserByIdQuery(id));
  }

  @Put(':id')
  @ApiBearerAuth('Authorization')
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard('jwt'), TokenRevocationGuard)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.commandBus.execute(
      new UpdateUserCommand(id, updateUserDto),
    );
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  @ApiHeader({ name: 'Authorization', required: true })
  @UseGuards(AuthGuard('jwt'), TokenRevocationGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('id') id: string) {
    return await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
