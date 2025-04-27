export abstract class IRevokeTokenUseCase {
  abstract execute(token: string): Promise<void>;
}
