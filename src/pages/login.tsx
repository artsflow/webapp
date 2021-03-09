import React, { useState, useCallback, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  Text,
  Box,
  Input,
  Button,
  Spinner,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  VStack,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

import Logo from 'svg/artsflow.svg'
import GoogleButton from 'svg/google-signin.svg'
import { Container } from 'components'
import { auth, googleAuthProvider } from 'lib/firebase'
import { UserContext } from 'lib/context'

const validateEmail = (str: string): boolean => !!str.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)

export default function Login(): JSX.Element {
  const router = useRouter()
  const [isLoggingIn, setLogginIn] = useState(false)
  const [isEmailValid, setEmailValid] = useState(false)
  const [emailValue, setEmailValue] = useState('')
  const { oobCode } = router.query
  const { authState } = useContext(UserContext)

  useEffect(() => {
    if (authState) {
      router.push('/')
    }
  }, [authState])

  useEffect(() => {
    if (oobCode && auth.isSignInWithEmailLink(window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn')

      if (!email) {
        email = window.prompt('Please provide your email for confirmation') as string
      }

      auth
        .signInWithEmailLink(email, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn')
          console.log('RESULT:', result)
        })
        .catch((error) => {
          console.error('email_auth_error:', error)
        })
    }
  }, [oobCode])

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmailValid(validateEmail(e.target.value))
      setEmailValue(e.target.value)
    },
    [emailValue]
  )

  const onLogin = useCallback(
    (e) => {
      e.preventDefault()
      console.log('onLogin')
      auth.sendSignInLinkToEmail(emailValue, { url: window.location.href, handleCodeInApp: true })
      window.localStorage.setItem('emailForSignIn', emailValue)
      setLogginIn(true)
    },
    [isLoggingIn, emailValue]
  )

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (isEmailValid) onLogin(e)
    },
    [isEmailValid, emailValue]
  )

  const onGoogleLogin = async () => {
    console.log('onGoogleLogin')
    await auth.signInWithPopup(googleAuthProvider)
  }

  return (
    <Container h="100%" justifyContent="center">
      <Link href="/">
        <a>
          <Logo width="242px" />
        </a>
      </Link>
      <Box>
        <form onSubmit={onSubmit}>
          {isLoggingIn ? (
            <VStack h="90px" justifyContent="center">
              <Text textAlign="center">Check your email now</Text>
              <Spinner color="af.pink" />
            </VStack>
          ) : (
            <Box h="90px">
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  fontSize="1.2em"
                  children="@"
                />
                <Input
                  borderColor="af.teal"
                  placeholder="hello@artsflow.com"
                  type="email"
                  onChange={handleEmailChange}
                  value={emailValue}
                />
                <InputRightElement
                  children={<CheckIcon color={isEmailValid ? 'af.teal' : 'grey'} />}
                />
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
            </Box>
          )}
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
