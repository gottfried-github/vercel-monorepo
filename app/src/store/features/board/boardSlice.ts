import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type BoardId = number | null

interface State {
  boardId: BoardId
}

const initialState: State = {
  boardId: null,
}

const slice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoardId: (state, { payload }: PayloadAction<BoardId>) => {
      state.boardId = payload
    },
  },
  selectors: {
    selectBoardId: state => state.boardId,
  },
})

export default slice

export const { setBoardId } = slice.actions
export const { selectBoardId } = slice.selectors
