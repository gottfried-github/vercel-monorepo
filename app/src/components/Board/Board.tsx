'use client'

import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TASK_STATUS } from '@/constants/constants'
import Column from '../Column/Column'

const Board = () => {
  const [disabled, setDisabled] = useState(false)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-3 gap-x-4 h-[calc(100vh-96px)]">
        <Column type={TASK_STATUS.PENDING} disabled={disabled} setDisabled={setDisabled} />
        <Column type={TASK_STATUS.IN_PROGRESS} disabled={disabled} setDisabled={setDisabled} />
        <Column type={TASK_STATUS.DONE} disabled={disabled} setDisabled={setDisabled} />
      </div>
    </DndProvider>
  )
}

export default Board
