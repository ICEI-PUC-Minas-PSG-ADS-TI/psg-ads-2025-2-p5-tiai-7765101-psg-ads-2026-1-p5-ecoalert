import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import dotenv from 'dotenv';
import ws from 'ws'

dotenv.config();

neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL as string
})

export const prisma = new PrismaClient({ adapter })