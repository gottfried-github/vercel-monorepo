import { useEffect, Ref } from 'react'
import z from 'zod'
import { axiosApi } from '@/utils/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAppQuery } from '@/utils/data'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDrop } from 'react-dnd'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Field, FieldLabel, FieldError } from '../ui/field'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Task as TaskType, DropCbInfo, ApiResponse } from '@/types'
import { ITEM_TYPES } from '@/constants/constants'
import { reorder } from '@/utils'
import { setIsError } from '@/store/features/error/errorSlice'
import { selectBoardId } from '@/store/features/board/boardSlice'
import { tasksQueryOptions } from '@/data/tasks'
import { TaskSchema } from '@/utils/schemas'
import Task from '../Task/Task'

interface Props {
  type: string
  disabled: boolean
  setDisabled: (disabled: boolean) => void
}

const Column = ({ type, disabled, setDisabled }: Props) => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  const boardId = useAppSelector(selectBoardId)

  const { data: tasks, isLoading } = useAppQuery({
    queryKey: [...tasksQueryOptions.queryKey, boardId, type],
    queryFn: tasksQueryOptions.queryFn,
  })

  const createTaskMutation = useMutation({
    mutationFn: async (task: Partial<TaskType>) => {
      const { data } = await axiosApi.post<ApiResponse<TaskType>>(`/tasks?boardId=${boardId}`, task)

      return data.data
    },
    onSuccess: task => {
      queryClient.setQueryData(
        [...tasksQueryOptions.queryKey, boardId, type],
        (oldData: TaskType[]) => {
          return [...oldData, task]
        }
      )

      reset()
    },
    onError: () => {
      dispatch(setIsError(true))
    },
  })

  const updateTaskMutation = useMutation({
    mutationFn: async ({
      taskId,
      taskData,
      oldTaskData,
    }: {
      taskId: number
      taskData: Partial<TaskType>
      oldTaskData: TaskType
    }) => {
      // update the task
      const { data: updateResult } = await axiosApi.patch<ApiResponse<TaskType>>(
        `/tasks/${taskId}`,
        taskData
      )

      return {
        updateResult: updateResult.data,
        oldTaskData,
      }
    },
    onSuccess: ({ updateResult, oldTaskData }) => {
      queryClient.setQueryData(
        [...tasksQueryOptions.queryKey, boardId, type],
        (oldData: TaskType[]) => {
          // append the task
          return [...oldData, updateResult]
        }
      )

      queryClient.setQueryData(
        [...tasksQueryOptions.queryKey, boardId, oldTaskData.status],
        (oldData: TaskType[]) => {
          // remove the task from the previous column
          return oldData.filter(task => task.id !== updateResult.id)
        }
      )
    },
    onError: () => {
      dispatch(setIsError(true))
    },
  })

  const updateOrderMutation = useMutation({
    mutationFn: async ({
      tasks,
      tasksMeta,
    }: {
      tasks: Partial<TaskType>[]
      tasksMeta: { index: number; order: number; item: TaskType }[]
    }) => {
      const { data } = await axiosApi.patch<ApiResponse<TaskType[]>>('/tasks/order', tasks)

      return {
        updatedTasks: data.data,
        tasksMeta: tasksMeta,
      }
    },
    onSuccess: ({ updatedTasks, tasksMeta }) => {
      queryClient.setQueryData(
        [...tasksQueryOptions.queryKey, boardId, type],
        (oldData: TaskType[]) => {
          const newData = [...oldData]

          newData.splice(tasksMeta[0].index, tasksMeta.length, ...updatedTasks)

          return newData
        }
      )
    },
    onError: () => {
      dispatch(setIsError(true))
    },
  })

  useEffect(() => {
    setDisabled(updateTaskMutation.isPending)
  }, [setDisabled, updateTaskMutation.isPending])

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    resolver: zodResolver(TaskSchema),
  })

  const [collected, drop] = useDrop({
    accept: [ITEM_TYPES.PENDING, ITEM_TYPES.IN_PROGRESS, ITEM_TYPES.DONE],
    drop: (item: TaskType, monitor) => {
      if (monitor.didDrop()) return

      dropCb({
        targetType: 'column',
        item,
      })
    },
  })

  const _handleSubmit: SubmitHandler<z.output<typeof TaskSchema>> = async values => {
    const task = {
      ...values,
      status: type,
      order: tasks && tasks.length ? tasks[tasks.length - 1].order + 1 : 0,
    }

    console.log('_handleSubmit - task:', task)

    createTaskMutation.mutate(task)
  }

  const dropCb = (dropInfo: DropCbInfo) => {
    // console.log('dropCb - dropInfo:', dropInfo)

    if (disabled) return

    // append the task to the end of the list
    if (
      (dropInfo.targetType === 'column' && dropInfo.item.status !== type) ||
      dropInfo.item.status !== type
    ) {
      // console.log('item is to be appended')

      updateTaskMutation.mutate({
        taskId: dropInfo.item.id,
        taskData: {
          status: type,
          order: tasks && tasks.length ? tasks[tasks.length - 1].order + 1 : 0,
        },
        oldTaskData: dropInfo.item,
      })
      // reorder
    } else if (dropInfo.targetType === 'task') {
      // console.log('item is to be reordered')
      reorderCb(dropInfo)
    }
  }

  const reorderCb = (dropInfo: DropCbInfo) => {
    if (!dropInfo.target || !tasks) return

    const targetI = tasks.map(task => task.id).indexOf(dropInfo.target.id)
    const sourceI = tasks.map(task => task.id).indexOf(dropInfo.item.id)

    const reorderedSlice = reorder(tasks, sourceI, targetI)

    // console.log('reorderCb - target, source:', dropInfo.target, dropInfo.item)
    // console.log('reorderCb - reorderedSlice:', reorderedSlice)

    updateOrderMutation.mutate({
      tasks: reorderedSlice.map(item => ({
        id: item.item.id,
        order: item.order,
      })),
      tasksMeta: reorderedSlice,
    })
  }

  if (isLoading) {
    return <div>Loading</div>
  }

  if (!tasks) return null

  return (
    <Card ref={drop as unknown as Ref<HTMLDivElement>} className="h-full">
      <CardContent className="flex flex-col gap-y-4">
        <Card>
          <CardContent>
            <form className="flex flex-col gap-y-2" onSubmit={handleSubmit(_handleSubmit)}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${type}_name`}>Task Name</FieldLabel>
                      <Input
                        id={`${type}_name`}
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
                      <FieldLabel htmlFor={`${type}_description`}>Task Description</FieldLabel>
                      <Textarea
                        id={`${type}_description`}
                        {...field}
                        placeholder="Task description"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                    </Field>
                  )
                }}
              />
              <Button className="self-end" disabled={createTaskMutation.isPending}>
                Create Task
              </Button>
            </form>
          </CardContent>
        </Card>
        {tasks.map(task => (
          <Task key={task.id} task={task} dropCb={dropCb} />
        ))}
      </CardContent>
    </Card>
  )
}

export default Column
