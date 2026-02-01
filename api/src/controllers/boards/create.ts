import type { Response } from 'express'
import prisma from '../../db'
import { AppError, isPrismaError } from '../../common'
import { type CreateBoardRequest } from '../../middleware/boards/create'

const create = async (req: CreateBoardRequest, res: Response) => {
  try {
    const createRes = await prisma.board.create({
      data: {
        name: req.body.name,
        created_at: new Date(),
      },
    })

    res.json({ message: 'created successfully', data: createRes })
  } catch (e) {
    if (isPrismaError(e)) {
      throw new AppError(500, e.message, e)
    } else {
      throw new AppError(500, 'Something went wrong', e)
    }
  }
}

export default create
