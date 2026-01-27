'use client'

import { ReactNode } from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectIsError } from '@/store/features/error/errorSlice'
import Header from '@/components/Header/Header'
import Error from '@/components/Error/Error'

interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  const isError = useAppSelector(selectIsError)

  return (
    <>
      <Header />
      <main className="pt-20 pb-4 mx-4">
        {isError ? <Error message="Something went wrong" /> : children}
      </main>
    </>
  )
}

export default Layout
