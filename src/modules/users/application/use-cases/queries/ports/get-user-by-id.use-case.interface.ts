import { UserEntity } from '../../../../domain/entities/user.entity';

export abstract class IGetUserByIdUseCase {
  abstract execute(id: string): Promise<UserEntity>;
}
