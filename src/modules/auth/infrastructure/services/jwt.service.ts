import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { IJwtServiceDomain } from '../../domain/services/jwt.service.domain';

@Injectable()
export class JwtService implements IJwtServiceDomain {
  constructor(private readonly jwtService: NestJwtService) {}

  async generateToken(payload: Record<string, any>): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }
}
