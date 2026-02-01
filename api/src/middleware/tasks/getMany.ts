import { z } from 'zod'
import _validate, { type ValidatedRequest } from 'express-zod-safe'
import { TASK_STATUS } from '../../common/constants'

const GetManyTasksQuerySchema = z.object({
  boardId: z.coerce.number<string>(),
  status: z.enum([TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE]),
})

const validate = _validate({ query: GetManyTasksQuerySchema })

// https://github.com/AngaBlue/express-zod-safe/tree/main?tab=readme-ov-file#-using-validatedrequest
export type GetManyTasksRequest = ValidatedRequest<{
  query: typeof GetManyTasksQuerySchema
}>

export default [validate]
