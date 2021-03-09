import { useEffect, useContext } from 'react'
import Head from 'next/head'
import { Grid, Box, HStack, VStack, Text, Button, Center } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { Footer, Header, SidePanel, Loading } from 'components'
import { UserContext } from 'lib/context'
import { auth } from 'lib/firebase'
import Logo from 'svg/artsflow.svg'

const UNAUTH_ROUTES = ['/login', '/terms']

interface Props {
  children: JSX.Element
}

export function Layout({ children }: Props) {
  const { authState, user, loading } = useContext(UserContext)
  const router = useRouter()
  console.log(user)
  const SelectedLayout = authState ? AuthLayout : UnAuthLayout

  useEffect(() => {
    if (!authState && !loading) {
      router.push('/login')
    }
  }, [authState])

  if (!user || loading) return <Loading />

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SelectedLayout>{children}</SelectedLayout>
    </>
  )
}

const NotAuthorizedLayout = () => {
  const handleLogout = () => {
    auth.signOut()
  }

  return (
    <Grid as="article" minHeight="100%" gridTemplateRows="1fr auto" gridTemplateColumns="100%">
      <Center>
        <VStack as="main" px={[4, 32]} spacing="2rem">
          <Logo width="214px" height="48px" />
          <Text fontSize="sm" color="gray.500">
            You're not a beta test user. Try again later.
          </Text>
          <Button onClick={handleLogout}>Log out</Button>
        </VStack>
      </Center>
    </Grid>
  )
}

const AuthLayout = ({ children }: Props) => {
  const { user } = useContext(UserContext)

  if (user.provider && !user?.isBetaTester) return <NotAuthorizedLayout />

  return (
    <Grid as="article" minHeight="100%" gridTemplateRows="auto 1fr auto" gridTemplateColumns="100%">
      <Header />
      <HStack as="main" bg="#E5E5E5">
        <SidePanel />
        <VStack h="100%" p="40px" w="100%" alignItems="flex-start">
          {children}
        </VStack>
      </HStack>
    </Grid>
  )
}

const UnAuthLayout = ({ children }: Props) => {
  const { authState, loading } = useContext(UserContext)
  const router = useRouter()

  useEffect(() => {
    if (!authState && !loading && !UNAUTH_ROUTES.includes(router.route)) {
      router.push('/login')
    }
  }, [authState, loading, router.route])

  if (!UNAUTH_ROUTES.includes(router.route)) {
    return <Loading />
  }

  return (
    <Grid as="article" minHeight="100%" gridTemplateRows="1fr auto" gridTemplateColumns="100%">
      <Box as="main" px={[4, 32]} p="100px" pos="relative">
        {loading ? <Loading /> : children}
      </Box>
      <Footer />
    </Grid>
  )
}
