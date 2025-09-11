import { ICommand, ICommandHandler } from '@/cqrs/types';
import { masterDb } from '@/db/connections';


// Command definition
export interface CreateUserCommand extends ICommand {
  type: 'CREATE_USER';
  payload: {
    name: string;
    email: string;
  };
}

// Command Handler
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  async handle(command: CreateUserCommand): Promise<any> {
    const { name, email } = command.payload;

    try {
      // Business logic validation
      if (!name || !email) {
        throw new Error('Name and email are required');
      }

      // Check if user already exists
      const existingUser = await masterDb.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create user in PostgreSQL (Master DB)
      const newUser = await masterDb.user.create({
        data: {
          name,
          email,
        }
      });

      console.log(`User created in master DB: ${newUser.id}`);
      
      // Return result (this will be used for sync message)
      return {
        recordId: newUser.id.toString(),
        ...newUser
      };

    } catch (error) {
      console.error('CreateUserHandler error:', error);
      throw error;
    }
  }
}