import type { Response } from 'express'
import prisma from '../../db'
import { AppError, isPrismaError } from '../../common'
import { type DeleteByIdRequest } from '../../middleware/boards/deleteById'

const deleteById = async (req: DeleteByIdRequest, res: Response) => {
  try {
    const deleteRes = await prisma.board.delete({
      where: {
        id: req.params.id,
      },
    })

    res.json({
      message: 'successfully deleted',
      data: deleteRes,
    })
  } catch (e) {
    if (isPrismaError(e)) {
      throw new AppError(500, e.message, e)
    } else {
      throw new AppError(500, 'Something went wrong', e)
    }
  }
}

export default deleteById
