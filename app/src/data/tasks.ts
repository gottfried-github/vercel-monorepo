import { QueryFunctionContext } from '@tanstack/react-query'
import { axiosApi } from '@/utils/axios'
import { Task, ApiResponse } from '@/types'

export const tasksQueryOptions = {
  queryKey: ['tasks'],
  queryFn: async ({ queryKey }: QueryFunctionContext) => {
    const [_key, boardId, status] = queryKey

    const { data } = await axiosApi.get<ApiResponse<Task[]>>(
      `/tasks?boardId=${boardId}&status=${status}`
    )

    return data.data
  },
}
