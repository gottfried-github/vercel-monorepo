import { QueryFunctionContext } from '@tanstack/react-query'
import { axiosApi } from '@/utils/axios'
import { Board, ApiResponse } from '@/types'

export const boardQueryOptions = {
  queryKey: ['board'],
  queryFn: async ({ queryKey }: QueryFunctionContext) => {
    const [_key, boardId] = queryKey

    if (!boardId) return null

    const { data } = await axiosApi.get<ApiResponse<Board>>(`/boards/${boardId}`)

    return data.data
  },
}
