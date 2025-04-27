import { UpdateUserDto } from '../../../../presentation/dtos/update-user.dto';
import { UserEntity } from '../../../../domain/entities/user.entity';

export abstract class IUpdateUserUseCase {
  abstract execute(id: string, updateData: UpdateUserDto): Promise<UserEntity>;
}
