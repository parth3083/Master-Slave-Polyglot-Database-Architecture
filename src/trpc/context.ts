import { commandBus } from "@/cqrs/commandBus";
import { queryBus } from "@/cqrs/queryBus";
import {
  masterDb,
  getSlaveDb,
  initializeMongoConnection,
} from "@/db/connections";
import { SyncManager } from "@/sync/syncManager";
import { PostgresToMongoSyncHandler } from "@/sync/syncHandler";

// Initializing CQRS buses

export const CommandBus = new commandBus();
export const QueryBus = new queryBus();

// initailize the sync manager

let syncManager: SyncManager | undefined;

const initailizeSyncManager = async () => {
  if (!syncManager) {
    const mongoDb = await initializeMongoConnection();
    const syncHandler = new PostgresToMongoSyncHandler(masterDb, mongoDb);
    syncManager = new SyncManager(syncHandler);
    await syncManager.start();
    console.log("Sync manager initialized and started");
  }
  return syncManager;
};
export interface Context {
  CommandBus: commandBus;
  QueryBus: queryBus;
  masterDb: typeof masterDb;
  slaveDb: any; // MongoDB database
  syncManager: SyncManager;
}

export const createContext = async (): Promise<Context> => {
  const slaveDb = await initializeMongoConnection();
  const syncManagerInstance = await initailizeSyncManager();

  return {
    CommandBus,
    QueryBus,
    masterDb,
    slaveDb,
    syncManager: syncManagerInstance,
  };
};