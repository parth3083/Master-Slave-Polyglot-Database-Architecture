import { ICommand, ICommandHandler, ISyncMessage } from "./types";
import { queueService } from "./queueBus";
import { v4 as uuidv4 } from "uuid";

export class commandBus {
  private handlers = new Map<string, ICommandHandler<any>>();

  register<T extends ICommand>(
    commandType: string,
    handler: ICommandHandler<T>
  ): void {
    this.handlers.set(commandType, handler);
    console.log(`Command handler registered : ${commandType}`);
  }

  async execute<T extends ICommand>(command: T): Promise<any> {
    const handler = this.handlers.get(command.type);
    if (!handler) {
      throw new Error(`No handler registered for command : ${command.type}`);
    }
    try {
      const result = await handler.handle(command);
      await this.createSyncMessage(command, result);
      return result;
    } catch (error) {
      console.error(`Command execution failed : ${command.type}`, error);
      throw error;
    }
  }
  private async createSyncMessage(
    command: ICommand,
    result: any
  ): Promise<void> {
    const syncMessage: ISyncMessage = {
      id: uuidv4(),
      operation: this.getOperationType(command.type),
      table: this.getTableFromCommand(command.type),
      recordId: result.id || result.recordId || "unknown",
      data: result,
      timestamp: new Date(),
      retryCount: 0,
    };
    await queueService.addSyncMessage(syncMessage);
  }
  private getOperationType(
    commandType: string
  ): "CREATE" | "UPDATE" | "DELETE" {
    if (commandType.toLocaleLowerCase().includes("create")) return "CREATE";
    if (commandType.toLocaleLowerCase().includes("update")) return "UPDATE";
    if (commandType.toLocaleLowerCase().includes("delete")) return "DELETE";
    return "CREATE";
  }
  private getTableFromCommand(commandType: string): string {
    const parts = commandType.toLowerCase().split("_");
    return parts[parts.length - 1];
  }
}
