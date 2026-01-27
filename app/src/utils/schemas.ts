import z from 'zod'

export const BoardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'name must be at least 3 characters')
    .max(10000, 'name must be at most 10 000 characters'),
})
