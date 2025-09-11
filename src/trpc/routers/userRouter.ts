import { z } from 'zod';
import { procedure, router } from '../trpc';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserCommand, DeleteUserCommand, UpdateUserCommand } from '@/cqrs/handlers/command';
import { GetAllUsersQuery, GetUserQuery } from '@/cqrs/handlers/query';


export const userRouter = router({
  // MUTATIONS (Commands - Write to Master DB)
  create: procedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Create command
      const command: CreateUserCommand = {
        id: uuidv4(),
        type: 'CREATE_USER',
        payload: {
          name: input.name,
          email: input.email,
        },
        timestamp: new Date(),
      };

      // Execute through command bus (writes to master, queues sync)
      return await ctx.CommandBus.execute(command);
    }),

  update: procedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const command: UpdateUserCommand = {
        id: uuidv4(),
        type: 'UPDATE_USER',
        payload: {
          id: input.id,
          name: input.name,
          email: input.email,
        },
        timestamp: new Date(),
      };

      return await ctx.CommandBus.execute(command);
    }),

  delete: procedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const command: DeleteUserCommand = {
        id: uuidv4(),
        type: 'DELETE_USER',
        payload: {
          id: input.id,
        },
        timestamp: new Date(),
      };

      return await ctx.CommandBus.execute(command);
    }),

  // QUERIES (Read from Slave DB)
  getById: procedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      const query: GetUserQuery = {
        id: uuidv4(),
        type: 'GET_USER',
        payload: {
          id: input.id,
        },
      };

      return await ctx.QueryBus.execute(query);
    }),

  getAll: procedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const query: GetAllUsersQuery = {
        id: uuidv4(),
        type: 'GET_ALL_USERS',
        payload: {
          limit: input.limit,
          offset: input.offset,
        },
      };

      return await ctx.QueryBus.execute(query);
    }),
});