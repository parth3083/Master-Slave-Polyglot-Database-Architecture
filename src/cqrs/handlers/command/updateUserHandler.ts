import { ICommand, ICommandHandler } from '@/cqrs/types';
import { masterDb } from '@/db/connections';

// Command definition
export interface UpdateUserCommand extends ICommand {
  type: 'UPDATE_USER';
  payload: {
    id: number;
    name?: string;
    email?: string;
  };
}

// Command Handler
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  async handle(command: UpdateUserCommand): Promise<any> {
    const { id, name, email } = command.payload;

    try {
      // Check if user exists
      const existingUser = await masterDb.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        throw new Error('User not found');
      }

      // Update user in PostgreSQL (Master DB)
      const updatedUser = await masterDb.user.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(email && { email }),
        }
      });

      console.log(`User updated in master DB: ${updatedUser.id}`);

      return {
        recordId: updatedUser.id.toString(),
        ...updatedUser
      };

    } catch (error) {
      console.error('UpdateUserHandler error:', error);
      throw error;
    }
  }
}