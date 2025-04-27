import { forwardRef, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './infrastructure/schemas/user.schema';
import { UsersController } from './presentation/controllers/users.controller';

// Command Handlers
import { CreateUserHandler } from './application/commands/handlers/create-user.handler';
import { UpdateUserHandler } from './application/commands/handlers/update-user.handler';
import { DeleteUserHandler } from './application/commands/handlers/delete-user.handler';

// Query Handlers
import { GetUsersHandler } from './application/queries/handlers/get-users.handler';
import { GetUserByIdHandler } from './application/queries/handlers/get-user-by-id.handler';

// Use Cases
import { CreateUserUseCase } from './application/use-cases/commands/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/commands/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/commands/delete-user.use-case';
import { GetUsersUseCase } from './application/use-cases/queries/get-users.use-case';
import { GetUserByIdUseCase } from './application/use-cases/queries/get-user-by-id.use-case';

// Use Case Interfaces
import { ICreateUserUseCase } from './application/use-cases/commands/ports/create-user.use-case.interface';
import { IUpdateUserUseCase } from './application/use-cases/commands/ports/update-user.use-case.interface';
import { IDeleteUserUseCase } from './application/use-cases/commands/ports/delete-user.use-case.interface';
import { IGetUsersUseCase } from './application/use-cases/queries/ports/get-users.use-case.interface';
import { IGetUserByIdUseCase } from './application/use-cases/queries/ports/get-user-by-id.use-case.interface';
import { IUserRepositoryDomain } from './domain/repositories/user.repository.domain';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { AuthModule } from '../auth/auth.module';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];
const QueryHandlers = [GetUsersHandler, GetUserByIdHandler];
const UseCases = [
  { provide: ICreateUserUseCase, useClass: CreateUserUseCase },
  { provide: IUpdateUserUseCase, useClass: UpdateUserUseCase },
  { provide: IDeleteUserUseCase, useClass: DeleteUserUseCase },
  { provide: IGetUsersUseCase, useClass: GetUsersUseCase },
  { provide: IGetUserByIdUseCase, useClass: GetUserByIdUseCase },
];

@Module({
  imports: [
    CqrsModule,
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    { provide: IUserRepositoryDomain, useClass: UserRepository },
    ...CommandHandlers,
    ...QueryHandlers,
    ...UseCases,
  ],
  exports: [IUserRepositoryDomain, ...UseCases],
})
export class UsersModule {}
