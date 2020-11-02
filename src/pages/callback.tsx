import React, { useEffect } from 'react'
import { Magic } from 'magic-sdk'
import { OAuthExtension } from '@magic-ext/oauth'
import { useRouter } from 'next/router'
import { VStack, Text } from '@chakra-ui/core'

import AfLogo from 'svg/af.svg'

const NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY: string = process.env
  .NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY as string

export default function Callback(): JSX.Element {
  const router = useRouter()

  const loginWithGoogle = async () => {
    try {
      const magic = new Magic(NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
        extensions: [new OAuthExtension()],
      })
      const result = await magic.oauth.getRedirectResult()

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${result.magic.idToken}`,
        },
        body: JSON.stringify({ userInfo: result.oauth.userInfo }),
      })

      if (res.status === 200) {
        router.push('/')
      } else {
        throw new Error(await res.text())
      }
    } catch (err) {
      console.error('An unexpected error occurred:', err)
    }
  }

  useEffect(() => {
    loginWithGoogle()
  }, [])

  return (
    <VStack h="100%" justifyContent="center" alignItems="center">
      <AfLogo width="142" height="186" />
      <Text>redirecting...</Text>
    </VStack>
  )
}
