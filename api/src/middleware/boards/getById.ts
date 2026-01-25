import { z } from 'zod'
import _validate, { type ValidatedRequest } from 'express-zod-safe'

const GetByIdParamsSchema = z.object({
  id: z.coerce.number<string>(),
})

const validate = _validate({ params: GetByIdParamsSchema })

export type GetByIdRequest = ValidatedRequest<{ params: typeof GetByIdParamsSchema }>

export default [validate]
