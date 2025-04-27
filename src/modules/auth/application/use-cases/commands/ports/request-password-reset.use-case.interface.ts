export abstract class IRequestPasswordResetUseCase {
  abstract execute(request: { email: string }): Promise<void>;
}
