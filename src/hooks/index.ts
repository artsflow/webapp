import { useCallback, useEffect, useRef } from 'react'
import { GraphQLClient, gql } from 'graphql-request'
import useSWR from 'swr'

import { API_URL } from 'lib/config'

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

const client = new GraphQLClient(`${API_URL}/graphql`, {
  credentials: 'include',
})

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
