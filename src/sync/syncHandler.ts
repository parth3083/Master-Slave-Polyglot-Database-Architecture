import { ISyncMessage } from "@/cqrs/types";
import { PrismaClient } from "@/generated/prisma";
import { MongoClient, Db } from "mongodb";

interface IsyncHadler {
  processMessage(message: ISyncMessage): Promise<boolean>;
}

export class PostgresToMongoSyncHandler implements IsyncHadler {
  private masterDb: PrismaClient;
  private slaveDb: Db;

  constructor(masterDb: PrismaClient, mongoDb: Db) {
    this.masterDb = masterDb;
    this.slaveDb = mongoDb;
  }
  async processMessage(message: ISyncMessage): Promise<boolean> {
    try {
      console.log(
        `Processing thee sync message: ${message.id} for table :${message.table}`
      );
      switch(message.operation){
        case 'CREATE':
          await this.handleCreate(message)
        case 'UPDATE':
          await this.handleUpdate(message)
        case 'DELETE':
          await this.handleDelete(message)
        default:
          throw new Error(`Unknown operation : ${message.operation}`)  
      }
      console.log(`Sync completed for the message  : ${message.id}`)
      return true
    } catch (error) {
      console.error(`Sync failed for message: ${message.id}`, error);
      return false;
    }
  }
  private async handleCreate(message: ISyncMessage): Promise<void> {
    const { table, data } = message;
    const mongoData = this.transformToMongoFormat(data, table);
    
    await this.slaveDb.collection(table).insertOne(mongoData);
  }

  private async handleUpdate(message: ISyncMessage): Promise<void> {
    const { table, recordId, data } = message;

    const mongoData = this.transformToMongoFormat(data, table);

    await this.slaveDb.collection(table).replaceOne(
      { id: parseInt(recordId) }, 
      mongoData,
      { upsert: true } 
    );
  }

  private async handleDelete(message: ISyncMessage): Promise<void> {
    const { table, recordId } = message;
    
    await this.slaveDb.collection(table).deleteOne({
      id: parseInt(recordId)
    });
  }
    private transformToMongoFormat(data: any, table: string): any {
    
    const transformed = { ...data };
  
    if (transformed.createdAt) {
      transformed.createdAt = new Date(transformed.createdAt);
    }
    if (transformed.updatedAt) {
      transformed.updatedAt = new Date(transformed.updatedAt);
    }
    
    transformed._syncedAt = new Date();
    transformed._sourceTable = table;
    
    return transformed;
  }

}
