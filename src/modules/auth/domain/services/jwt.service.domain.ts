export abstract class IJwtServiceDomain {
  abstract generateToken(payload: Record<string, any>): Promise<string>;
  abstract verifyToken(token: string): Promise<any>;
}
