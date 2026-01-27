import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  isError: boolean
}

const initialState: State = {
  isError: false,
}

const slice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setIsError: (state, { payload }: PayloadAction<boolean>) => {
      state.isError = payload
    },
  },
  selectors: {
    selectIsError: state => state.isError,
  },
})

export default slice

export const { setIsError } = slice.actions
export const { selectIsError } = slice.selectors
