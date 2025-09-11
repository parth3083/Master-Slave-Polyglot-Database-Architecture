import { IQuery, IQueryHandler } from '@/cqrs/types';
import { getSlaveDb } from '@/db/connections';

// Query definition
export interface GetUserQuery extends IQuery {
  type: 'GET_USER';
  payload: {
    id: number;
  };
}

// Query Handler
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  async handle(query: GetUserQuery): Promise<any> {
    const { id } = query.payload;

    try {
      const slaveDb = getSlaveDb();
      
      // Query MongoDB (Slave DB)
      const user = await slaveDb.collection('user').findOne({ id });

      if (!user) {
        throw new Error('User not found');
      }

      console.log(`User retrieved from slave DB: ${user.id}`);

      // Transform MongoDB format back to API format
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };

    } catch (error) {
      console.error('GetUserHandler error:', error);
      throw error;
    }
  }
}