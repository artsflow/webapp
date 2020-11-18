import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { VStack, Text } from '@chakra-ui/core'

import { loginWithGoogle } from 'services/auth'
import AfLogo from 'svg/af.svg'

export default function Callback(): JSX.Element {
  const router = useRouter()

  const login = async () => {
    try {
      await loginWithGoogle()
      router.push('/')
    } catch (err) {
      console.error('An unexpected error occurred:', err)
    }
  }

  useEffect(() => {
    login()
  }, [])

  return (
    <VStack h="100%" justifyContent="center" alignItems="center">
      <AfLogo width="142" height="186" />
      <Text>Artsflow is logging you in...</Text>
    </VStack>
  )
}
