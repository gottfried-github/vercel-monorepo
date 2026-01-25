import { z } from 'zod'
import _validate, { type ValidatedRequest } from 'express-zod-safe'

const DeleteByIdParamsSchema = z.object({
  id: z.coerce.number<string>(),
})

const validate = _validate({ params: DeleteByIdParamsSchema })

export type DeleteByIdRequest = ValidatedRequest<{ params: typeof DeleteByIdParamsSchema }>

export default [validate]
