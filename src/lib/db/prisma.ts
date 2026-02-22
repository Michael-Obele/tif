import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';

declare global {
	var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient({
	log: dev ? ['warn', 'error'] : []
});

if (dev) {
	globalThis.prisma = prisma;
}

export default prisma;
