'use client'

import { useAppQuery } from '@/utils/data'
import { testQueryOptions } from '@/data/test'
import { useEffect } from 'react'

const Test = () => {
  const { isLoading } = useAppQuery(testQueryOptions)

  useEffect(() => {
    console.log('Test - isLoading:', isLoading)
  }, [isLoading])

  return <div>Test</div>
}

export default Test
