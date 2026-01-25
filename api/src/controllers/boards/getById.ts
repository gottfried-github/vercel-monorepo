import type { Response } from 'express'
import prisma from '../../db'
import { AppError, isPrismaError } from '../../common'
import type { GetByIdRequest } from '../../middleware/boards/getById'

const getById = async (req: GetByIdRequest, res: Response) => {
  try {
    const board = await prisma.board.findFirst({
      where: {
        id: req.params.id,
      },
    })

    res.json({
      message: "here's your board",
      data: board,
    })
  } catch (e) {
    if (isPrismaError(e)) {
      throw new AppError(500, e.message, e)
    } else {
      throw new AppError(500, 'Something went wrong', e)
    }
  }
}

export default getById
