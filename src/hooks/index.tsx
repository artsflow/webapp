import { useCallback, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { get } from 'lodash'

import { API_URL } from 'lib/config'

const jsonFetcher = (selector?: string) => (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => (selector ? get(data, selector, null) : data ?? null))

export function useUser() {
  const { data, isValidating } = useSWR(`${API_URL}/user`, jsonFetcher())
  console.log('useUser', data)
  const user = data?.user ?? null
  return { user, loading: isValidating }
}

export function useIsMounted() {
  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
    }
  }, [])

  return useCallback(() => isMountedRef.current, [])
}

export function useFirstRender() {
  const firstRender = useRef(true)

  useEffect(() => {
    firstRender.current = false
  }, [])

  return firstRender.current
}
