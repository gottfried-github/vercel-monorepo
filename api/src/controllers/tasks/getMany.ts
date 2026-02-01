import type { Response } from 'express'
import type { TaskStatus } from '../../../generated/prisma/enums'
import prisma from '../../db'
import { type GetManyTasksRequest } from '../../middleware/tasks/getMany'
import { isPrismaError, AppError } from '../../common'

const getMany = async (req: GetManyTasksRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        board_id: req.query.boardId,
        status: req.query.status as TaskStatus,
      },
      orderBy: {
        order: 'asc',
      },
    })

    res.json({
      message: "here's your tasks",
      data: tasks,
    })
  } catch (e) {
    if (isPrismaError(e)) {
      throw new AppError(500, e.message, e)
    } else {
      throw new AppError(500, 'Something went wrong', e)
    }
  }
}

export default getMany
