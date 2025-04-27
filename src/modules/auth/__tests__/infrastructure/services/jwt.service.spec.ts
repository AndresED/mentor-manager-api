import { Test } from '@nestjs/testing';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtService } from '../../../infrastructure/services/jwt.service';

describe('JwtService', () => {
  let service: JwtService;
  let nestJwtService: jest.Mocked<NestJwtService>;

  beforeEach(async () => {
    const mockNestJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtService,
        {
          provide: NestJwtService,
          useValue: mockNestJwtService,
        },
      ],
    }).compile();

    service = moduleRef.get<JwtService>(JwtService);
    nestJwtService = moduleRef.get<NestJwtService>(
      NestJwtService,
    ) as jest.Mocked<NestJwtService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should call nestJwtService.sign with the provided payload', async () => {
      const payload = { sub: 'user123', email: 'test@example.com' };
      const mockToken = 'mock.jwt.token';

      nestJwtService.sign.mockReturnValue(mockToken);

      const result = await service.generateToken(payload);

      expect(nestJwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockToken);
    });
  });

  describe('verifyToken', () => {
    it('should call nestJwtService.verify with the provided token', async () => {
      const token = 'mock.jwt.token';
      const decodedPayload = { sub: 'user123', email: 'test@example.com' };

      nestJwtService.verify.mockReturnValue(decodedPayload);

      const result = await service.verifyToken(token);

      expect(nestJwtService.verify).toHaveBeenCalledWith(token);
      expect(result).toEqual(decodedPayload);
    });

    it('should propagate errors from nestJwtService.verify', async () => {
      const token = 'invalid.token';
      const error = new Error('Invalid token');

      nestJwtService.verify.mockImplementation(() => {
        throw error;
      });

      await expect(service.verifyToken(token)).rejects.toThrow(error);
      expect(nestJwtService.verify).toHaveBeenCalledWith(token);
    });
  });
});
