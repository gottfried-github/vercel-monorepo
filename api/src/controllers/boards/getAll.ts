import type { Request, Response } from 'express'
import prisma from '../../db'
import { AppError, isPrismaError } from '../../common'

const getAll = async (req: Request, res: Response) => {
  try {
    const boards = await prisma.board.findMany()

    res.json({
      message: "here's your boards",
      data: boards,
    })
  } catch (e) {
    if (isPrismaError(e)) {
      throw new AppError(500, e.message, e)
    } else {
      throw new AppError(500, 'Something went wrong', e)
    }
  }
}

export default getAll
