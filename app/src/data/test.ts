// import { axiosApi } from '@/utils/axios'
// import { ApiResponse, Board } from '@/types'

export const testQueryOptions = {
  queryKey: ['test'],
  queryFn: async () => {
    console.log('testQueryOptions, queryFn')

    throw new Error('shit')
  },
}
