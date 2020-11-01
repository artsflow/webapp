import React, { useEffect, useState } from 'react'
import { Text, Link } from '@chakra-ui/core'
import { useRouter } from 'next/router'

import Logo from 'svg/artsflow.svg'
import { Container } from 'components'
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

  return (
    <Container height="100vh" justifyContent="center">
      <Logo width="242px" />
      {initialized ? (
        <>
          <Text>welcome {user?.email}</Text>
          <Link href="/api/logout">Logout</Link>
        </>
      ) : (
        <Text>loading...</Text>
      )}
    </Container>
  )
}
