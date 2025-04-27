export abstract class IDeleteUserUseCase {
  abstract execute(id: string): Promise<void>;
}
