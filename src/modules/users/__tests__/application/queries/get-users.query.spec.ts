import { GetUsersQuery } from '../../../application/queries/get-users.query';

describe('GetUsersQuery', () => {
  it('should create a query instance', () => {
    const query = new GetUsersQuery();

    expect(query).toBeInstanceOf(GetUsersQuery);
  });
});
