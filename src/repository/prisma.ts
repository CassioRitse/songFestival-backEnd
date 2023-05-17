import { PrismaClient } from "@prisma/client";
const prismaCli = new PrismaClient();

export const dbPrisma = prismaCli;
