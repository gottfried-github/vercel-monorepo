import { z } from 'zod'
import _validate, { type ValidatedRequest } from 'express-zod-safe'

const TaskSchema = z.object({
  id: z.number(),
  order: z.number().max(1e12),
})

const OrderTasksBodySchema = z.array(TaskSchema)

const validate = _validate({ body: OrderTasksBodySchema })

// https://github.com/AngaBlue/express-zod-safe/tree/main?tab=readme-ov-file#-using-validatedrequest
export type OrderTasksRequest = ValidatedRequest<{
  body: typeof OrderTasksBodySchema
}>

export default [validate]
