import { PrismaClient } from "@/generated/prisma/client";

export const masterDb = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.DATABASE_URL
    }
  }
});


