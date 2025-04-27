export abstract class IRefreshTokenUseCase {
  abstract execute(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}
