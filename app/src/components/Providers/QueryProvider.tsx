'use client'

import { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from '@/data/queryClient'

interface Props {
  children: ReactNode
}

const QueryProvider = ({ children }: Props) => {
  const queryClient = getQueryClient()

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryProvider
