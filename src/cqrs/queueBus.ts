import { ISyncMessage } from "./types";

interface IQueueService {
  addSyncMessage(message: ISyncMessage): Promise<void>;
  getSyncMessage(): Promise<ISyncMessage | null>;
  acknowledgeMessage(messageId: string): Promise<void>;
  requeueMessage(messageId: string): Promise<void>;
}

// Implementing the in memory queue (Replace this with Redis)
class InMemoryQueueService implements IQueueService {
  private queue: ISyncMessage[] = [];
  private processing: Map<string, ISyncMessage> = new Map();

  async addSyncMessage(message: ISyncMessage): Promise<void> {
    this.queue.push(message);
    console.log(`Added the message into the queue ${message.id}`);
  }

  async getSyncMessage(): Promise<ISyncMessage | null> {
    const message = this.queue.shift();
    if (message) {
      this.processing.set(message.id, message);
    }
    return message || null;
  }

  async acknowledgeMessage(messageId: string): Promise<void> {
    this.processing.delete(messageId);
    console.log(`message acknowledged ${messageId}`);
  }

  async requeueMessage(messageId: string): Promise<void> {
    const message = this.processing.get(messageId);
    if (message) {
      message.retryCount += 1;
      this.queue.push(message);
      this.processing.delete(messageId);
      console.log(
        `Message requeued: ${messageId}, retry count : ${message.retryCount}`
      );
    }
  }
  getQueueStatus() {
    return {
      waiting: this.queue.length,
      processing: this.processing.size,
    };
  }
}

export const queueService = new InMemoryQueueService();
export type { IQueueService };
