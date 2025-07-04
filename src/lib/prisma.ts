// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Validate environment variables
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

console.log("Environment check:", {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL_SET: !!process.env.DATABASE_URL,
  DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 50) + "...",
  DATABASE_HOST: process.env.DATABASE_URL?.match(/@([^/]+)/)?.[1],
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn", "info"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
