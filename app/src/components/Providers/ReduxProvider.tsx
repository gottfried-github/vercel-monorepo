'use client'

import type { AppStore } from '@/store/store'
import { makeStore } from '@/store/store'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { Provider } from 'react-redux'

interface Props {
  readonly children: ReactNode
}

const ReduxProvider = ({ children }: Props) => {
  const storeRef = useRef<AppStore | null>(null)

  if (storeRef.current === null) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  // useEffect(() => {
  //   if (storeRef.current != null) {
  //     // configure listeners using the provided defaults
  //     // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
  //     const unsubscribe = setupListeners(storeRef.current.dispatch);
  //     return unsubscribe;
  //   }
  // }, []);

  // eslint-disable-next-line react-hooks/refs
  return <Provider store={storeRef.current}>{children}</Provider>
}

export default ReduxProvider
