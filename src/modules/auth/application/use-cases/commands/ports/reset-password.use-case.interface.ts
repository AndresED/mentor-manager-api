export abstract class IResetPasswordUseCase {
  abstract execute(token: string, newPassword: string): Promise<void>;
}
