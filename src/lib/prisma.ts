import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    prismaAdapter: PrismaPg | undefined;
};

const databaseUrl = process.env.DATABASE_URL;


if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
}

const adapter =
    globalForPrisma.prismaAdapter ??
    new PrismaPg({
        connectionString: databaseUrl,
    });

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
    globalForPrisma.prismaAdapter = adapter;
}