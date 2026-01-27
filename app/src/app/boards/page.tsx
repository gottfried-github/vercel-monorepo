import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/data/queryClient'
import { fetchData, FetchDataError } from '@/utils/network'
import { boardsQueryOptions } from '@/data/boards'
import Error from '@/components/Error/Error'
import Boards from '@/components/Boards/Boards'

export const dynamic = 'force-dynamic'

const BoardsPage = async () => {
  const queryClient = getQueryClient()
  let e = null

  try {
    await queryClient.fetchQuery({
      ...boardsQueryOptions,
      queryFn: async () => {
        const data = await fetchData(`${process.env.API_URL}/boards`)

        return data.data
      },
    })
  } catch (_e) {
    e = _e
  }

  if (!e) {
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Boards />
      </HydrationBoundary>
    )
  } else {
    if (e instanceof FetchDataError) {
      return <Error message={e.body.message} />
    } else {
      return <Error message="Something went wrong. Please, reload the page or contact support." />
    }
  }
}

export default BoardsPage
