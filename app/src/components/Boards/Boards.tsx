'use client'

import z from 'zod'
import { axiosApi } from '@/utils/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch } from '@/store/hooks'
import { Board, ApiResponse } from '@/types'
import { boardsQueryOptions } from '@/data/boards'
import { setIsError } from '@/store/features/error/errorSlice'
import { Button } from '../ui/button'
import { Field, FieldLabel, FieldError } from '../ui/field'
import { Input } from '../ui/input'
import { BoardSchema } from '@/utils/schemas'
import BoardsList from '../BoardsList/BoardsList'

const Boards = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  const mutation = useMutation({
    mutationFn: async (values: z.output<typeof BoardSchema>) => {
      const { data } = await axiosApi.post<ApiResponse<Board>>('/boards', values)

      return data
    },
    onSuccess: () => {
      // I invalidate instead of setQueryData because the results might be sorted on the server
      queryClient.invalidateQueries({ queryKey: boardsQueryOptions.queryKey })
      reset()
    },
    onError: () => {
      dispatch(setIsError(true))
    },
  })

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(BoardSchema),
  })

  const _handleSubmit: SubmitHandler<z.output<typeof BoardSchema>> = async values => {
    console.log('_handleSubmit - values:', values)
    mutation.mutate(values)
  }

  return (
    <div className="flex flex-col gap-y-4">
      <form className="flex flex-col gap-y-2" onSubmit={handleSubmit(_handleSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Board Name</FieldLabel>
                <Input
                  id="name"
                  {...field}
                  placeholder="Board name"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )
          }}
        />
        <Button className="self-end" disabled={mutation.isPending}>
          Create Board
        </Button>
      </form>
      <BoardsList />
    </div>
  )
}

export default Boards
