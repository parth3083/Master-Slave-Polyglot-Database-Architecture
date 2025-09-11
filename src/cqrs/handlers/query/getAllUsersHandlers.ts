import { IQuery, IQueryHandler } from '@/cqrs/types';
import { getSlaveDb } from '@/db/connections';

// Query definition
export interface GetAllUsersQuery extends IQuery {
  type: 'GET_ALL_USERS';
  payload: {
    limit?: number;
    offset?: number;
  };
}

// Query Handler
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  async handle(query: GetAllUsersQuery): Promise<any> {
    const { limit = 10, offset = 0 } = query.payload;

    try {
      const slaveDb = getSlaveDb();
      
      // Query MongoDB (Slave DB)
      const users = await slaveDb.collection('user')
        .find({})
        .skip(offset)
        .limit(limit)
        .toArray();

      console.log(`Retrieved ${users.length} users from slave DB`);

      // Transform MongoDB format back to API format
      return users.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }));

    } catch (error) {
      console.error('GetAllUsersHandler error:', error);
      throw error;
    }
  }
}