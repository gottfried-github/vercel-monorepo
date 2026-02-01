import type { Response } from 'express'
import prisma from '../../db'
import { type CreateTaskRequest } from '../../middleware/tasks/create'
import { isPrismaError, AppError } from '../../common'
import type { TaskStatus } from '../../../generated/prisma/enums'

const create = async (req: CreateTaskRequest, res: Response) => {
  try {
    const createRes = await prisma.task.create({
      data: {
        ...req.body,
        status: req.body.status as TaskStatus,
        board: {
          connect: {
            id: req.query.boardId,
          },
        },
      },
    })

    res.json({
      message: 'successfully created the task',
      data: createRes,
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

  res.json({ message: 'created successfully' })
}

export default create
