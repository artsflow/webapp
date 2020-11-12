import React, { useEffect, useState } from 'react'
import { Text, Box } from '@chakra-ui/core'
import { useRouter } from 'next/router'

import { GraphQLClient } from 'graphql-request'
import useSWR from 'swr'

import { useUser, useFirstRender } from 'hooks'
import { API_URL } from 'lib/config'

const QUERY = `
  query sayHello {
    sayHello
  }
`

const client = new GraphQLClient(`${API_URL}/graphql`)

export default function Home(): JSX.Element {
  const router = useRouter()
  const [initialized, setInitialized] = useState(false)
  const isFirstRender = useFirstRender()
  const { user, loading: userLoading } = useUser()

  const { data, error } = useSWR(QUERY, (query) => client.request(query))
  console.log(data, error)

  useEffect(() => {
    if (user && !userLoading && !initialized) {
      setInitialized(true)
    }
  }, [user, userLoading, initialized])

  useEffect(() => {
    if (!(user || userLoading) && !isFirstRender) {
      router.push('/login')
    }
  }, [user, userLoading])

  return <Box justifyContent="center">{initialized && <Text>welcome</Text>}</Box>
}
