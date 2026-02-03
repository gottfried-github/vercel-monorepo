'use client'

import { useState, useEffect } from 'react'
import z from 'zod'
import { useAppQuery } from '@/utils/data'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch } from '@/store/hooks'
import { Button } from '../ui/button'
import { Field, FieldLabel, FieldError } from '../ui/field'
import { Input } from '../ui/input'
import { boardQueryOptions } from '@/data/board'
import { setBoardId } from '@/store/features/board/boardSlice'
import Board from '../Board/Board'

const BoardInputSchema = z.object({
  id: z.coerce.number<string>(),
})

const BoardController = () => {
  const dispatch = useAppDispatch()

  const [_boardId, _setBoardId] = useState<number | null>(null)

  const { data: board, isLoading } = useAppQuery({
    queryKey: [...boardQueryOptions.queryKey, _boardId],
    queryFn: boardQueryOptions.queryFn,
  })

  useEffect(() => {
    if (!board) {
      dispatch(setBoardId(null))
    } else {
      dispatch(setBoardId(board.id))
    }
  }, [dispatch, board])

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      id: '',
    },
    resolver: zodResolver(BoardInputSchema),
  })

  const _handleSubmit: SubmitHandler<z.output<typeof BoardInputSchema>> = async values => {
    console.log('_handleSubmit - values:', values)

    _setBoardId(values.id)
  }

  if (isLoading) return <div>Loading</div>

  return (
    <div className="flex flex-col gap-y-4">
      <form className="flex flex-col gap-y-2" onSubmit={handleSubmit(_handleSubmit)}>
        <Controller
          name="id"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="board-id">Board Name</FieldLabel>
                <Input
                  id="board-id"
                  {...field}
                  placeholder="Board id"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )
          }}
        />
        <Button className="self-end">Show Board</Button>
      </form>
      {!board || _boardId === null ? null : (
        <>
          <h1>{board.name}</h1>
          <Board />
        </>
      )}
    </div>
  )
}

export default BoardController
