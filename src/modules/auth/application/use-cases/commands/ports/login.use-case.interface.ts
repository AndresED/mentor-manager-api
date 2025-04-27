import { LoginDto } from '../../../../presentation/dtos/login.dto';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    email: string;
    name: string;
  };
}

export abstract class ILoginUseCase {
  abstract execute(credentials: LoginDto): Promise<LoginResponse>;
}
