import { PrismaClient } from '@prisma/client';
import { config, log } from './config';

declare global {
  // Allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  return new PrismaClient({
    log: config.features.debugMode 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

// Prevent multiple instances of Prisma Client in development
export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  log.info('Shutting down Prisma client...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  log.info('Shutting down Prisma client...');
  await prisma.$disconnect();
  process.exit(0);
});
