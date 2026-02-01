import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

console.log('initializing database client - process.env.DATABASE_URL:', process.env.DATABASE_URL)

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: pool })

export default prisma
