/* data related types */
export type Board = {
  id: number
  name: string
}

export type Task = {
  id: number
  status: string
  order: number
  name: string
  description: string
}

export interface ApiResponse<Data> {
  message: string
  data: Data
}

/* UI related types */
export interface DropCbInfo {
  targetType: string
  target?: Task
  item: Task
}

export type DropCb = (dropInfo: DropCbInfo) => void
