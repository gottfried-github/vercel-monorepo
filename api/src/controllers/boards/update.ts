import type { Response } from 'express'
import prisma from '../../db'
import { AppError, isPrismaError } from '../../common'
import type { UpdateBoardRequest } from '../../middleware/boards/update'

const update = async (req: UpdateBoardRequest, res: Response) => {
  try {
    const boardUpdated = await prisma.board.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    })

    res.json({
      message: 'successfully updated',
      data: boardUpdated,
    })
  } catch (e) {
    if (isPrismaError(e)) {
      throw new AppError(500, e.message, e)
    } else {
      throw new AppError(500, 'Something went wrong', e)
    }
  }
}

export default update
