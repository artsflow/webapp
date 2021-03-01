import React, { useState, useCallback } from 'react'
// import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  Text,
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

import Logo from 'svg/artsflow.svg'
import GoogleButton from 'svg/google-signin.svg'
import { Container } from 'components'

const validateEmail = (str: string): boolean => !!str.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)

export default function Login(): JSX.Element {
  // const router = useRouter()
  const [isLoggingIn] = useState(false)
  const [isEmailValid, setEmailValid] = useState(false)
  const [emailValue, setEmailValue] = useState('')

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
