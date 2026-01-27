export type Board = {
  id: number
  name: string
}

export interface ApiResponse<Data> {
  message: string
  data: Data
}
