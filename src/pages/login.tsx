import React, { useEffect, useState, useCallback } from 'react'
import { Magic } from 'magic-sdk'
import { OAuthExtension } from '@magic-ext/oauth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  Text,
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/core'
import { CheckIcon } from '@chakra-ui/icons'

import Logo from 'svg/artsflow.svg'
import GoogleButton from 'svg/google-signin.svg'
import { Container } from 'components'
import { useUser, useIsMounted } from 'hooks'

const NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY: string = process.env
  .NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY as string

const validateEmail = (str: string): boolean => !!str.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)

export default function Home(): JSX.Element {
  const router = useRouter()
  const { user } = useUser()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isEmailValid, setEmailValid] = useState(false)
  const [emailValue, setEmailValue] = useState('')
  const [errorMsg, setErrorMsg] = useState(undefined)
  const isMounted = useIsMounted()

  useEffect(() => {
    if (user) router.push('/')
  }, [user])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValid(validateEmail(e.target.value))
    setEmailValue(e.target.value)
  }

  const login = useCallback(
    async (email) => {
      if (isMounted() && errorMsg) setErrorMsg(undefined)

      try {
        const magic = new Magic(NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY)
        const didToken = await magic.auth.loginWithMagicLink({ email })

        const res = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${didToken}`,
          },
          body: JSON.stringify({ email }),
        })

        if (res.status === 200) {
          router.push('/')
        } else {
          throw new Error(await res.text())
        }
      } catch (err) {
        console.error('An unexpected error occurred:', err)
        if (isMounted()) setErrorMsg(err.message)
      }
    },
    [errorMsg]
  )

  const onLogin = useCallback(
    (e) => {
      e.preventDefault()
      if (isLoggingIn) return
      setIsLoggingIn(true)
      login(emailValue).then(() => setIsLoggingIn(false))
    },
    [login, isLoggingIn, emailValue]
  )

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (isEmailValid) onLogin(e)
    },
    [isEmailValid, emailValue]
  )

  const onGoogleLogin = async () => {
    const magic = new Magic(NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
      extensions: [new OAuthExtension()],
    })

    await magic.oauth.loginWithRedirect({
      provider: 'google',
      redirectURI: `${window.location.origin}/callback`,
    })
  }

  return (
    <Container height="100vh" justifyContent="center">
      <Link href="/">
        <a>
          <Logo width="242px" />
        </a>
      </Link>
      <Box>
        <form onSubmit={onSubmit}>
          <InputGroup>
            <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em" children="@" />
            <Input
              borderColor="af.teal"
              placeholder="hello@artsflow.com"
              type="email"
              onChange={handleEmailChange}
              value={emailValue}
            />
            <InputRightElement children={<CheckIcon color={isEmailValid ? 'af.teal' : 'grey'} />} />
          </InputGroup>
          <Button
            w="full"
            bg="af.pink"
            mt="2"
            disabled={!isEmailValid || isLoggingIn}
            isLoading={isLoggingIn}
            onClick={onLogin}
          >
            Continue with email
          </Button>
          <Text textAlign="center" py="2">
            or
          </Text>
          <Button variant="link" outline="none" w="full" p="0" onClick={onGoogleLogin}>
            <GoogleButton />
          </Button>
        </form>
      </Box>
    </Container>
  )
}
