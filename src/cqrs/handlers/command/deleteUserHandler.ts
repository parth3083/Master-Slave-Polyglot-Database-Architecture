import { ICommand, ICommandHandler } from "@/cqrs/types";
import { masterDb } from "@/db/connections";


// Command definition
export interface DeleteUserCommand extends ICommand {
  type: 'DELETE_USER';
  payload: {
    id: number;
  };
}

// Command Handler
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  async handle(command: DeleteUserCommand): Promise<any> {
    const { id } = command.payload;

    try {
      // Check if user exists
      const existingUser = await masterDb.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        throw new Error('User not found');
      }

      // Delete user from PostgreSQL (Master DB)
      const deletedUser = await masterDb.user.delete({
        where: { id }
      });

      console.log(`User deleted from master DB: ${deletedUser.id}`);

      return {
        recordId: deletedUser.id.toString(),
        ...deletedUser
      };

    } catch (error) {
      console.error('DeleteUserHandler error:', error);
      throw error;
    }
  }
}