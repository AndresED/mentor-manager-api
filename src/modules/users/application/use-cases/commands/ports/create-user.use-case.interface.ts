import { UserEntity } from '../../../../domain/entities/user.entity';
export abstract class ICreateUserUseCase {
  abstract execute(
    email: string,
    name: string,
    password: string,
  ): Promise<UserEntity>;
}
