import type { Response } from 'express'
import prisma from '../../db'
import { type OrderTasksRequest } from '../../middleware/tasks/order'
import { isPrismaError, AppError } from '../../common'

const order = async (req: OrderTasksRequest, res: Response) => {
  try {
    const updateRes = await prisma.$transaction(
      req.body.map(task => {
        return prisma.task.update({
          where: {
            id: task.id,
          },
          data: {
            order: task.order,
          },
        })
      })
    )

    res.json({
      message: 'successfully reordered',
      data: updateRes,
    })
  } catch (e) {
    if (isPrismaError(e)) {
      console.log('prisma error')
      throw new AppError(500, e.message, e)
    } else {
      console.log('non-prisma error')
      throw new AppError(500, 'Something went wrong', e)
    }
  }
}

export default order
