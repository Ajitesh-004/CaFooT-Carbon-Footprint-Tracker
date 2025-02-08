import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

async function test() {
  try {
    await Prisma.$connect();
    console.log("✅ Prisma connected successfully!");
  } catch (error) {
    console.error("❌ Prisma connection failed:", error);
  } finally {
    await Prisma.$disconnect();
  }
}

test();

export default Prisma;