import { UserEntity } from '../../../../domain/entities/user.entity';

export abstract class IGetUsersUseCase {
  abstract execute(): Promise<UserEntity[]>;
}
