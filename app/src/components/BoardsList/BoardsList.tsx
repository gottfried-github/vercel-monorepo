import { useAppQuery } from '@/utils/data'
import { boardsQueryOptions } from '@/data/boards'
import BoardsItem from '../BoardsItem/BoardsItem'

const BoardsList = () => {
  const { data: boards, isLoading } = useAppQuery(boardsQueryOptions)

  if (isLoading) {
    return <div>Loading</div>
  }

  if (!boards) return null

  return (
    <li className="flex flex-col gap-y-4">
      {boards.map(board => (
        <BoardsItem key={board.id} board={board} />
      ))}
    </li>
  )
}

export default BoardsList
