import { ISyncMessage } from "@/cqrs/types";
import dbConnect from "@/utils/mongoConnect";
dbConnect();
import { queueService } from "@/cqrs/queueBus";

interface ISyncHandler {
  start(): void;
  end(): void;
  processMessage(message: ISyncMessage): Promise<boolean>;
}

export class SyncHandler implements ISyncHandler {
  private isRunning: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;
  private readonly POLL_INTERVAL = 1000; //1second
  private readonly MAX_RETRIES = 5;

  constructor(private handlerId: string) {}

  start(): void {
    if (this.isRunning) {
      console.log(`Sync handler ${this.handlerId} isalready running`);
      return;
    }
    this.isRunning = true;
    console.log(`Starting Sync Handler ${this.handlerId}`);

    // start polling messages
    this.processingInterval = setInterval(async () => {
      await this.pollAndProcess();
    }, this.POLL_INTERVAL);
  }

  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    console.log(`Stopped the sync handler ${this.handlerId}`);
  }

  private async pollAndProcess(): Promise<void> {
    if (!this.isRunning) return;
    try {
      const message = await queueService.getSyncMessage();
      if (message) {
        console.log(
          `Handler ${this.handlerId} processing the message : ${message.id}`
        );
        const success = await this.processMessage(message);
        if (success) {
          await queueService.acknowledgeMessage(message.id);
          console.log(`Message ${message.id} processed successfully`);
        } else {
          await this.handleFailedMessage(message);
        }
      }
    } catch (error) {
      console.error(`Error in sync handler ${this.handlerId}:`, error);
    }
  }
  async processMessage(message: ISyncMessage): Promise<boolean> {
    try {
      switch (message.operation) {
        case "CREATE":
          return await this.handleCreate(message);
        case "UPDATE":
          return await this.handleCreate(message);
        case "DELETE":
          return await this.handleCreate(message);
        default:
          console.log(`Unknow operation ${message.operation}`);
          return false;
      }
    } catch (error) {
      console.error(`Failed to process message ${message.id}:`, error);
      return false;
    }
  }
  private handleCreate(message:ISyncMessage):Promise<boolean>{
    try {
        const {table, data} = message
        await ()
    } catch (error) {
        
    }
  }
}
