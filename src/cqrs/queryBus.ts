import { IQuery, IQueryHandler } from "./types";

export class queryBus {
  private handlers = new Map<string, IQueryHandler<any>>();
  register<T extends IQuery>(
    queryType: string,
    handler: IQueryHandler<T>
  ): void {
    this.handlers.set(queryType, handler);
    console.log(`Command handler registered : ${queryType}`);
  }
  async execute<T extends IQuery>(query: T): Promise<any> {
    const handler = this.handlers.get(query.type);
    if (!handler) {
      throw new Error(`No handler registered for command : ${query.type}`);
    }
    try {
      return await handler.handle(query);
    } catch (error) {
      console.error(`Command execution failed : ${query.type}`, error);
      throw error;
    }
  }
}
