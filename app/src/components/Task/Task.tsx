import { useState, useRef, useMemo } from 'react'
import z from 'zod'
import { axiosApi } from '@/utils/axios'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useAppDispatch } from '@/store/hooks'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDrag, useDrop } from 'react-dnd'
import { Button } from '../ui/button'
import { Item, ItemContent, ItemTitle, ItemDescription } from '../ui/item'
import { Field, FieldLabel, FieldError } from '../ui/field'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { ApiResponse, DropCb, Task as TaskType } from '@/types'
import { ITEM_TYPES } from '@/constants/constants'
import { setIsError } from '@/store/features/error/errorSlice'
import { tasksQueryOptions } from '@/data/tasks'
import { TaskSchema } from '@/utils/schemas'

interface Props {
  boardId: number
  task: TaskType
  dropCb: DropCb
}

const Task = ({ boardId, task, dropCb }: Props) => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const ref = useRef(null)

  const [isInEditMode, setIsInEditMode] = useState(false)
  const itemType = useMemo(() => `ITEM_${task.status}`, [task.status])

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axiosApi.delete<ApiResponse<TaskType>>(`/tasks/${task.id}`)

      return data.data
    },
    onSuccess: deletedTask => {
      queryClient.setQueryData(
        [...tasksQueryOptions.queryKey, boardId, task.status],
        (oldData: TaskType[]) => {
          return oldData.filter(task => task.id !== deletedTask.id)
        }
      )
    },
    onError: () => {
      dispatch(setIsError(true))
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (values: z.output<typeof TaskSchema>) => {
      const { data } = await axiosApi.patch<ApiResponse<TaskType>>(`/tasks/${task.id}`, values)

      return data.data
    },
    onSuccess: updatedTask => {
      queryClient.setQueryData(
        [...tasksQueryOptions.queryKey, boardId, task.status],
        (oldData: TaskType[]) => {
          return oldData.map(task => {
            if (task.id !== updatedTask.id) return task

            return updatedTask
          })
        }
      )

      setIsInEditMode(false)
    },
    onError: () => {
      dispatch(setIsError(true))
    },
  })

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      name: task.name,
      description: task.description,
    },
    resolver: zodResolver(TaskSchema),
  })

  const _handleSubmit: SubmitHandler<z.output<typeof TaskSchema>> = async values => {
    console.log('_handleSubmit, values:', values)

    updateMutation.mutate(values)
  }

  const [collectedDrag, drag] = useDrag({
    type: itemType,
    item: task,
  })

  const [collectedDrop, drop] = useDrop({
    accept: [ITEM_TYPES.PENDING, ITEM_TYPES.IN_PROGRESS, ITEM_TYPES.DONE],
    drop: (item: TaskType) => {
      // console.log('dropped item - tagret, item:', task, item)
      dropCb({
        targetType: 'task',
        target: task,
        item,
      })
    },
  })

  const handleDeleteClick = () => {
    deleteMutation.mutate()
  }

  const handleEditClick = () => {
    setIsInEditMode(true)
  }

  const handleCancelClick = () => {
    reset({
      name: task.name,
      description: task.description,
    })
    setIsInEditMode(false)
  }

  // eslint-disable-next-line react-hooks/refs
  drag(drop(ref))

  return (
    <Item ref={ref} variant="outline">
      <ItemContent>
        {!isInEditMode ? (
          <>
            <ItemTitle>{task.name}</ItemTitle>
            <ItemDescription>{task.description}</ItemDescription>
          </>
        ) : (
          <form
            className="flex flex-col gap-y-2"
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
                      id={`${task.id}_name`}
                      {...field}
                      placeholder="Task name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )
              }}
            />
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <Textarea
                      id={`${task.id}_description`}
                      {...field}
                      placeholder="Task description"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )
              }}
            />
          </form>
        )}
        <div className="flex justify-end gap-x-2">
          {!isInEditMode ? (
            <>
              <Button
                disabled={deleteMutation.isPending || updateMutation.isPending}
                onClick={handleEditClick}
              >
                Edit
              </Button>
              <Button
                onClick={handleDeleteClick}
                disabled={deleteMutation.isPending || updateMutation.isPending}
              >
                Delete
              </Button>
            </>
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
        </div>
      </ItemContent>
    </Item>
  )
}

export default Task
