'use client'

import { useAppDispatch } from '@/store/hooks'
import { setIsError } from '@/store/features/error/errorSlice'

import { useEffect } from 'react'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

export const useAppQuery = <Data>(queryOptions: UseQueryOptions<Data>) => {
  const dispatch = useAppDispatch()
  const queryRes = useQuery(queryOptions)

  useEffect(() => {
    if (!queryRes.error) return

    dispatch(setIsError(true))
  }, [dispatch, queryRes.error])

  return queryRes
}
