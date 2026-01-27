'use client'

import { ReactNode } from 'react'
import QueryProvider from './QueryProvider'
import ReduxProvider from './ReduxProvider'

interface Props {
  children: ReactNode
}

const Providers = ({ children }: Props) => {
  return (
    <QueryProvider>
      <ReduxProvider>{children}</ReduxProvider>
    </QueryProvider>
  )
}

export default Providers
