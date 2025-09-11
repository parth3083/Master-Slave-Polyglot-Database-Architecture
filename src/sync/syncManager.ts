import { queueService } from "@/cqrs/queueBus";
import { PostgresToMongoSyncHandler } from "./syncHandler";
import { ISyncMessage } from "@/cqrs/types";

export class SyncManager {
  private syncHandler: PostgresToMongoSyncHandler;
  private isRunning = false;
  private maxEntries = 3;

  constructor(syncHandler: PostgresToMongoSyncHandler) {
    this.syncHandler = syncHandler;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log("Sync manager is already running");
      return;
    }
    this.isRunning = true;
    console.log("Starting the sync manger with 2 workers");

    //starting the 2 workers
    this.startWorker("Worker1");
    this.startWorker("Worker2");
  }

  stop(): void {
    this.isRunning = false;
    console.log("Stopping the sync running....");
  }

  private async startWorker(workerId: string): Promise<void> {
    console.log(`${workerId} started working`);
    while (this.isRunning) {
      try {
        const message = await queueService.getSyncMessage();
        if (!message) {
          await this.sleep(1000);
          continue;
        }
        console.log(`${workerId} processing message : ${message.id}`);
        // process the sync message
        const success = await this.syncHandler.processMessage(message);
        if (success) {
          await queueService.acknowledgeMessage(message.id);
          console.log(`${workerId} completed the message : ${message.id}`);
        } else {
          await this.handleFailedMessage(message, workerId);
        }
      } catch (error) {
        console.error(`${workerId} error:`, error);
        await this.sleep(5000);
      }
    }
    console.log(`${workerId} stopped`);
  }
  private async handleFailedMessage(
    message: ISyncMessage,
    workerId: string
  ): Promise<void> {
    if (message.retryCount < this.maxEntries) {
      console.log(
        `${workerId} requeuing message: ${message.id}, retry: ${
          message.retryCount + 1
        }`
      );
      await queueService.requeueMessage(message.id);
    } else {
      console.error(
        `${workerId} max retries reached for message: ${message.id}, moving to dead letter`
      );
      // Here you could move to dead letter queue or log for manual intervention
      await queueService.acknowledgeMessage(message.id); // Remove from processing
    }
  }
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  getStatus() {
    return {
      isRunning: this.isRunning,
      queueStatus: (queueService as any).getQueueStatus?.() || "Unknown",
    };
  }
}
