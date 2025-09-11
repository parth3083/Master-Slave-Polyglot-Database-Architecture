import { PrismaClient } from '@/generated/prisma';
import { MongoClient } from 'mongodb';

// PostgreSQL Master Database (Writes)
export const masterDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

// MongoDB Slave Database (Reads)
let mongoClient: MongoClient;
let slaveDb: any;

export const initializeMongoConnection = async () => {
  if (!mongoClient) {
    const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost:27017';
    mongoClient = new MongoClient(mongoUrl);
    await mongoClient.connect();
    slaveDb = mongoClient.db(process.env.MONGO_DATABASE_NAME || 'slave_db');
    console.log('MongoDB slave connection established');
  }
  return slaveDb;
};

export const getSlaveDb = () => {
  if (!slaveDb) {
    throw new Error('MongoDB connection not initialized. Call initializeMongoConnection first.');
  }
  return slaveDb;
};

// Health check functions
export const checkMasterConnection = async () => {
  try {
    await masterDb.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Master DB connection failed:', error);
    return false;
  }
};

export const checkSlaveConnection = async () => {
  try {
    const db = getSlaveDb();
    await db.admin().ping();
    return true;
  } catch (error) {
    console.error('Slave DB connection failed:', error);
    return false;
  }
};