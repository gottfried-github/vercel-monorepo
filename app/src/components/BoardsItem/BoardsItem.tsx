import { useState } from 'react'
import { axiosApi } from '@/utils/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppDispatch } from '@/store/hooks'
import z from 'zod'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/button'
import { Item, ItemContent, ItemTitle, ItemDescription, ItemActions } from '../ui/item'
import { Field, FieldError } from '../ui/field'
import { Input } from '../ui/input'
import { Board, ApiResponse } from '@/types'
import { boardsQueryOptions } from '@/data/boards'
import { setIsError } from '@/store/features/error/errorSlice'
import { BoardSchema } from '@/utils/schemas'

interface Props {
  board: Board
}

const BoardsItem = ({ board }: Props) => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  const [isInEditMode, setIsInEditMode] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosApi.delete<ApiResponse<Board>>(`/boards/${board.id}`)

      return data
    },
    onSuccess: data => {
      queryClient.setQueryData(boardsQueryOptions.queryKey, (oldData: Board[]) => {
        return oldData.filter(board => board.id !== data.data.id)
      })
    },
    onError: () => {
      dispatch(setIsError(true))
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (values: z.output<typeof BoardSchema>) => {
      const { data } = await axiosApi.patch<ApiResponse<Board>>(`/boards/${board.id}`, values)

      return data
    },
    onSuccess: data => {
      queryClient.setQueryData(boardsQueryOptions.queryKey, (oldData: Board[]) => {
        return oldData.map(board => {
          if (board.id !== data.data.id) return board

          return data.data
        })
      })

      setIsInEditMode(false)
    },
    onError: () => {
      dispatch(setIsError(true))
    },
  })

  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: board.name,
    },
    resolver: zodResolver(BoardSchema),
  })

  const _handleSubmit: SubmitHandler<z.output<typeof BoardSchema>> = values => {
    console.log('_handleSubmit - values:', values)
    updateMutation.mutate(values)
  }

  const handleEditClick = () => {
    setIsInEditMode(true)
  }

  const handleCancelClick = () => {
    setIsInEditMode(false)
  }

  const handleDeleteClick = () => {
    deleteMutation.mutate()
  }

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemDescription>{`#${board.id}`}</ItemDescription>
        {!isInEditMode ? (
          <ItemTitle>{board.name}</ItemTitle>
        ) : (
          <form
            onSubmit={ev => {
              ev.preventDefault()
            }}
          >
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      disabled={deleteMutation.isPending || updateMutation.isPending}
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )
              }}
            />
          </form>
        )}
      </ItemContent>
      <ItemActions>
        {!isInEditMode ? (
          <Button onClick={handleEditClick}>Edit</Button>
        ) : (
          <>
            <Button
              onClick={handleSubmit(_handleSubmit)}
              disabled={deleteMutation.isPending || updateMutation.isPending}
            >
              Save
            </Button>
            <Button
              onClick={handleCancelClick}
              disabled={deleteMutation.isPending || updateMutation.isPending}
            >
              Cancel
            </Button>
          </>
        )}
        <Button
          onClick={handleDeleteClick}
          disabled={deleteMutation.isPending || updateMutation.isPending}
        >
          Delete
        </Button>
      </ItemActions>
    </Item>
  )
}

export default BoardsItem
