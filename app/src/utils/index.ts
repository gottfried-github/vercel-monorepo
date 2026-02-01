import { Task } from '@/types'

export class BadResponseError extends Error {
  public error: boolean

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)

    this.error = true
  }
}

export const reorder = (items: Task[], sourceI: number, targetI: number) => {
  const sliceStartI = sourceI < targetI ? sourceI : targetI
  const sliceEndI = sourceI > targetI ? sourceI : targetI

  const sourceItem = items[sourceI]
  const targetItem = items[targetI]

  const slice = items.slice(sliceStartI, sliceEndI + 1)

  const sliceSourceI = sourceI < targetI ? 0 : sourceI - targetI
  const sliceTargetI = targetI < sourceI ? 0 : targetI - sourceI

  const initialOrder = sourceI < targetI ? sourceItem.order : targetItem.order

  slice.splice(sliceTargetI, 0, slice.splice(sliceSourceI, 1)[0])

  const sliceMeta = slice.map((item, i) => {
    return {
      index: sliceStartI + i,
      order: initialOrder + i,
      item,
    }
  })

  return sliceMeta
}
