import { PrismaClient } from "@prisma/client";
import config from "../config/index";

// Prevent multiple instances in development
const globalForPrisma = global;

// Initialize prisma client with config

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: config.db.url,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
