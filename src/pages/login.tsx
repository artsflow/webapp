import React, { useRef, useState, useCallback, useEffect, useContext } from 'react'
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'

import Logo from 'svg/artsflow.svg'
import GoogleButton from 'svg/google-signin.svg'
import { Container } from 'components'
import { auth, googleAuthProvider } from 'lib/firebase'
import { UserContext } from 'lib/context'

const validateEmail = (str: string): boolean => !!str.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)

export default function Login(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const [isLoggingIn, setLogginIn] = useState(false)
  const [isEmailValid, setEmailValid] = useState(false)
  const [confirmEmailValue, setConfirmEmailValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const { oobCode } = router.query
  const { authState } = useContext(UserContext)
  const emailRef = useRef() as any

  useEffect(() => {
    if (authState) {
      router.push('/')
    }
  }, [authState])

  useEffect(() => {
    if (oobCode && auth.isSignInWithEmailLink(window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn')

      if (email) {
        auth
          .signInWithEmailLink(email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn')
          })
          .catch((error) => {
            console.error('email_auth_error1:', error)
          })
      } else {
        onOpen()
      }
    }
  }, [oobCode])

  const handleConfirnmEmail = () => {
    auth
      .signInWithEmailLink(confirmEmailValue, window.location.href)
      .then(() => {
        window.localStorage.removeItem('emailForSignIn')
      })
      .catch((error) => {
        console.error('email_auth_error2:', error)
      })
  }

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmailValid(validateEmail(e.target.value))
      setEmailValue(e.target.value)
    },
    [emailValue]
  )

  const handleEmailConfirmChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfirmEmailValue(e.target.value)
    },
    [emailValue]
  )

  const onLogin = useCallback(
    (e) => {
      e.preventDefault()
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

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm your email:</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                ref={emailRef}
                type="email"
                onChange={handleEmailConfirmChange}
                value={confirmEmailValue}
                placeholder="Email"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr="1rem">
              Cancel
            </Button>
            <Button onClick={handleConfirnmEmail} bg="af.pink" color="white">
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  )
}
