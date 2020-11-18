import { useCallback, useEffect, useRef } from 'react'
import { gql } from 'graphql-request'
import useSWR from 'swr'

import { client } from 'services/client'

export const GET_ME = gql`
  query getMe {
    getMe {
      email
      firstName
      lastName
      picture
    }
  }
`

export function useUser() {
  const { data, isValidating } = useSWR(GET_ME, (query) => client.request(query))
  const user = data?.getMe?.email ? data?.getMe : null
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
