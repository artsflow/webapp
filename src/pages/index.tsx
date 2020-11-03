import React, { useEffect, useState } from 'react'
import { Text, Box } from '@chakra-ui/core'
import { useRouter } from 'next/router'

import { useUser, useFirstRender } from 'hooks'

export default function Home(): JSX.Element {
  const router = useRouter()
  const [initialized, setInitialized] = useState(false)
  const isFirstRender = useFirstRender()
  const { user, loading: userLoading } = useUser()

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
