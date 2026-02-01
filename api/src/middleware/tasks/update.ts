import { z } from 'zod'
import _validate, { type ValidatedRequest } from 'express-zod-safe'
import { TASK_STATUS } from '../../common/constants'

const UpdateTaskBodySchema = z
  .object({
    status: z.enum([TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE]).optional(),
    order: z.number().max(1e12).optional(),
    name: z.string().min(3).max(10000).optional(),
    description: z.string().min(3).max(1e6).optional(),
  })
  .refine(
    body => {
      for (const v of Object.values(body)) {
        if (v !== undefined) return true
      }

      return false
    },
    {
      message: 'body must have at least one property defined',
    }
  )

const UpdateTaskParamsSchema = z.object({
  id: z.coerce.number<string>(),
})

const validate = _validate({ body: UpdateTaskBodySchema, params: UpdateTaskParamsSchema })

// https://github.com/AngaBlue/express-zod-safe/tree/main?tab=readme-ov-file#-using-validatedrequest
export type UpdateTaskRequest = ValidatedRequest<{
  body: typeof UpdateTaskBodySchema
  params: typeof UpdateTaskParamsSchema
}>

export default [validate]
