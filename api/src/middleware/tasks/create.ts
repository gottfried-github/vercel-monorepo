import { z } from 'zod'
import _validate, { type ValidatedRequest } from 'express-zod-safe'
import { TASK_STATUS } from '../../common/constants'

const CreateTaskBodySchema = z.object({
  status: z.enum([TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE]),
  order: z.number().max(1e12),
  name: z.string().min(3).max(10000),
  description: z.string().min(3).max(1e6),
})

const CreateTaskQuerySchema = z.object({
  boardId: z.coerce.number<string>(),
})

const validate = _validate({ body: CreateTaskBodySchema, query: CreateTaskQuerySchema })

// https://github.com/AngaBlue/express-zod-safe/tree/main?tab=readme-ov-file#-using-validatedrequest
export type CreateTaskRequest = ValidatedRequest<{
  body: typeof CreateTaskBodySchema
  query: typeof CreateTaskQuerySchema
}>

export default [validate]
