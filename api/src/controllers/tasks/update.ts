import type { Response } from 'express'
import prisma from '../../db'
import { type UpdateTaskRequest } from '../../middleware/tasks/update'
import { isPrismaError, AppError } from '../../common'
import type { TaskStatus } from '../../../generated/prisma/enums'

const update = async (req: UpdateTaskRequest, res: Response) => {
  try {
    const taskUpdated = await prisma.task.update({
      where: {
        id: req.params.id,
      },
      data: req.body as typeof req.body & { status: TaskStatus | undefined },
    })

    res.json({
      message: 'successfully updated',
      data: taskUpdated,
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
