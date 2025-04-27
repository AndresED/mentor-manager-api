import { GetUserByIdQuery } from '../../../application/queries/get-user-by-id.query';

describe('GetUserByIdQuery', () => {
  it('should create a query instance', () => {
    const query = new GetUserByIdQuery('user-id');

    expect(query.id).toBe('user-id');
  });
});
