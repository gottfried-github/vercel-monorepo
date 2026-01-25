import { z } from 'zod'
import _validate, { type ValidatedRequest } from 'express-zod-safe'

const UpdateBoardBodySchema = z
  .object({
    name: z.string().min(3).max(10000).optional(),
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

const UpdateBoardParamsSchema = z.object({
  id: z.coerce.number<string>(),
})

const validate = _validate({ body: UpdateBoardBodySchema, params: UpdateBoardParamsSchema })

// https://github.com/AngaBlue/express-zod-safe/tree/main?tab=readme-ov-file#-using-validatedrequest
export type UpdateBoardRequest = ValidatedRequest<{
  body: typeof UpdateBoardBodySchema
  params: typeof UpdateBoardParamsSchema
}>

export default [validate]
