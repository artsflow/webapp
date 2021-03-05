import React, { useEffect, useState, useContext } from 'react'
import { Text, Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { UserContext } from 'lib/context'

export default function Home(): JSX.Element {
  const router = useRouter()
  const [initialized, setInitialized] = useState(false)
  const { user } = useContext(UserContext)

  useEffect(() => {
    if (user && !initialized) {
      setInitialized(true)
    }
  }, [user, initialized])

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user])

  return (
    <Box justifyContent="center">
      {initialized && (
        <>
          <Text>welcome</Text>
        </>
      )}
    </Box>
  )
}
