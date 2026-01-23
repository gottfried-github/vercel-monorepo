import express from 'express'

import { Prisma, PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: pool })

let count = 0

const main = async () => {
  const app = express()

  app.get('/hello', async (req, res) => {
    const createRes = await prisma.board.create({
      data: {
        name: `Board #${count}`,
      },
    })

    count++

    return res.json({ message: 'Hello World!', data: createRes })
  })

  app.listen(3000, () => {
    console.log('listening on port 3000')
  })
}

main()
