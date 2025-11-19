// src/lib/prisma.js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

// Cache the Prisma Client in a global variable to avoid creating new connections on every request,
// which is especially important in a serverless environment.
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
