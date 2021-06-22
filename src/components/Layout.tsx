import { useEffect, useContext } from 'react'
import Head from 'next/head'
import { Grid, Box, HStack, VStack, Text, Button, Center } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { isMobileOnly } from 'react-device-detect'
// import { identify } from 'react-fullstory'

import { Footer, Header, SidePanel, Loading } from 'components'
import { trackSmallScreenUsed } from 'analytics'
import { Card } from 'components/UI'
import { UserContext } from 'lib/context'
// import { isProd } from 'lib/utils'
import { auth } from 'lib/firebase'
import Logo from 'svg/artsflow.svg'

const UNAUTH_ROUTES = ['/login', '/terms']

interface Props {
  children: JSX.Element
}

export function Layout({ children }: Props) {
  const { authState, user, loading } = useContext(UserContext)
  const SelectedLayout = authState ? AuthLayout : UnAuthLayout
  const router = useRouter()

  useEffect(() => {
    if (user) {
      window.analytics?.identify(user.id)
      // if (isProd) {
      //   identify(user.id, {
      //     email: user.email,
      //     displayName: user.displayName,
      //   })
      // }
    }

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

export const NotAuthorizedLayout = () => {
  const handleLogout = () => {
    auth.signOut()
  }

  return (
    <Grid as="article" minHeight="100%" gridTemplateRows="1fr auto" gridTemplateColumns="100%">
      <Center>
        <VStack as="main" px={[4, 32]} spacing="2rem">
          <Logo width="214px" height="48px" />
          <Text fontSize="sm" color="gray.500">
            Artsflow is invite-only for now. Please try again later.
          </Text>
          <Button onClick={handleLogout}>Log out</Button>
        </VStack>
      </Center>
    </Grid>
  )
}

const AuthLayout = ({ children }: Props) => (
  <Grid as="article" minHeight="100%" gridTemplateRows="auto 1fr auto" gridTemplateColumns="100%">
    <Header />
    <HStack as="main" bg="#F9F9F9" spacing="0">
      <SidePanel />
      <VStack h="100%" w="full" alignItems="flex-start" spacing="0">
        {isMobileOnly ? <MobileScreenInfo /> : children}
      </VStack>
    </HStack>
  </Grid>
)

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

const MobileScreenInfo = () => {
  useEffect(() => {
    trackSmallScreenUsed()
  }, [])

  return (
    <Card m="1rem" w="200px">
      <Text fontWeight="bold" mb="0.5rem" color="af.teal">
        This app is optimized for large screens
      </Text>
      <Text>Please load it on a tablet or laptop</Text>
    </Card>
  )
}
