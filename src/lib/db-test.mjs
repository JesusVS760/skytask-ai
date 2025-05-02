// src/lib/db-direct-test.mjs
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client directly in this file
const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Try to query the database
    const userCount = await prisma.user.count();
    console.log("✅ Database connection successful!");
    console.log(`Number of users: ${userCount}`);
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testConnection()
  .then(() => {
    console.log("Test completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Test failed with exception:", error);
    process.exit(1);
  });
