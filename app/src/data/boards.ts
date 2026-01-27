import { axiosApi } from '@/utils/axios'
import { ApiResponse, Board } from '@/types'
import { QUERY_KEYS } from './keys'

export const boardsQueryOptions = {
  queryKey: [QUERY_KEYS.BOARDS],
  queryFn: async () => {
    const { data } = await axiosApi.get<ApiResponse<Board[]>>('/boards')

    return data.data
  },
}
