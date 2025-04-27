import { Test } from '@nestjs/testing';
import { GetUsersHandler } from '../../../../application/queries/handlers/get-users.handler';
import { GetUsersQuery } from '../../../../application/queries/get-users.query';
import { IGetUsersUseCase } from '../../../../application/use-cases/queries/ports/get-users.use-case.interface';
import { mockUserEntityList } from '../../../mocks/user.entity.mock';

describe('GetUsersHandler', () => {
  let handler: GetUsersHandler;
  let useCase: jest.Mocked<IGetUsersUseCase>;

  beforeEach(async () => {
    const getUsersUseCase = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetUsersHandler,
        {
          provide: IGetUsersUseCase,
          useValue: getUsersUseCase,
        },
      ],
    }).compile();

    handler = moduleRef.get<GetUsersHandler>(GetUsersHandler);
    useCase = moduleRef.get(IGetUsersUseCase);
  });

  it('should execute get users use case', async () => {
    const query = new GetUsersQuery();
    useCase.execute.mockResolvedValue(mockUserEntityList);

    const result = await handler.execute();

    expect(result).toBe(mockUserEntityList);
    expect(useCase.execute).toHaveBeenCalled();
  });
});
