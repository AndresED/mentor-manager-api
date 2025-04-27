import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '../get-users.query';
import { IGetUsersUseCase } from '../../use-cases/queries/ports/get-users.use-case.interface';
import { UserEntity } from '../../../domain/entities/user.entity';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly getUsersUseCase: IGetUsersUseCase) {}

  async execute(): Promise<UserEntity[]> {
    return await this.getUsersUseCase.execute();
  }
}
