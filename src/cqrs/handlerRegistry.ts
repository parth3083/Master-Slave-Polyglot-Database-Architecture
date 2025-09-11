import { CommandBus, QueryBus } from "@/trpc/context";
import { CreateUserHandler } from "./handlers/command/createUserHandler";
import { UpdateUserHandler } from "./handlers/command/updateUserHandler";
import { DeleteUserHandler } from "./handlers/command/deleteUserHandler";
import { GetUserHandler } from "./handlers/query/getUserHandlers";
import { GetAllUsersHandler } from "./handlers/query/getAllUsersHandlers";

// Register Command Handlers
export const registerCommandHandlers = () => {
  CommandBus.register('CREATE_USER', new CreateUserHandler());
  CommandBus.register('UPDATE_USER', new UpdateUserHandler());
  CommandBus.register('DELETE_USER', new DeleteUserHandler());
  
  console.log('✅ Command handlers registered');
};

// Register Query Handlers
export const registerQueryHandlers = () => {
  QueryBus.register('GET_USER', new GetUserHandler());
  QueryBus.register('GET_ALL_USERS', new GetAllUsersHandler());
  
  console.log('✅ Query handlers registered');
};

// Initialize all handlers
export const initializeHandlers = () => {
  registerCommandHandlers();
  registerQueryHandlers();
  console.log('🚀 All CQRS handlers initialized');
};