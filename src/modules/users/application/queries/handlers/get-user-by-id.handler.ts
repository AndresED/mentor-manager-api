import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../get-user-by-id.query';
import { IGetUserByIdUseCase } from '../../use-cases/queries/ports/get-user-by-id.use-case.interface';
import { UserEntity } from '../../../domain/entities/user.entity';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly getUserByIdUseCase: IGetUserByIdUseCase) {}

  async execute(query: GetUserByIdQuery): Promise<UserEntity> {
    return await this.getUserByIdUseCase.execute(query.id);
  }
}
