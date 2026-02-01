import { z } from 'zod'
import _validate, { type ValidatedRequest } from 'express-zod-safe'

const CreateBoardSchema = z.object({
  name: z.string().min(3).max(10000),
})

const validate = _validate({ body: CreateBoardSchema })

// https://github.com/AngaBlue/express-zod-safe/tree/main?tab=readme-ov-file#-using-validatedrequest
export type CreateBoardRequest = ValidatedRequest<{ body: typeof CreateBoardSchema }>

export default [validate]
