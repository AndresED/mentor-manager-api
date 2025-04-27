import { Test } from '@nestjs/testing';
import { GetUserByIdHandler } from '../../../../application/queries/handlers/get-user-by-id.handler';
import { GetUserByIdQuery } from '../../../../application/queries/get-user-by-id.query';
import { IGetUserByIdUseCase } from '../../../../application/use-cases/queries/ports/get-user-by-id.use-case.interface';
import { mockUserEntity } from '../../../mocks/user.entity.mock';

describe('GetUserByIdHandler', () => {
  let handler: GetUserByIdHandler;
  let useCase: jest.Mocked<IGetUserByIdUseCase>;

  beforeEach(async () => {
    const getUserByIdUseCase = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetUserByIdHandler,
        {
          provide: IGetUserByIdUseCase,
          useValue: getUserByIdUseCase,
        },
      ],
    }).compile();

    handler = moduleRef.get<GetUserByIdHandler>(GetUserByIdHandler);
    useCase = moduleRef.get(IGetUserByIdUseCase);
  });

  it('should execute get user by id use case', async () => {
    const query = new GetUserByIdQuery('user-id');
    useCase.execute.mockResolvedValue(mockUserEntity);

    const result = await handler.execute(query);

    expect(result).toBe(mockUserEntity);
    expect(useCase.execute).toHaveBeenCalledWith(query.id);
  });
});
