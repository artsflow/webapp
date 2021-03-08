import { useEffect, useContext } from 'react'
import Head from 'next/head'
import { Grid, Box, HStack, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { Footer, Header, SidePanel, Loading } from 'components'
import { UserContext } from 'lib/context'

const UNAUTH_ROUTES = ['/login', '/terms']

interface Props {
  children: JSX.Element
}

export function Layout({ children }: Props) {
  const { user, loading } = useContext(UserContext)
  const router = useRouter()

  const SelectedLayout = user ? AuthLayout : UnAuthLayout

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login')
    }
  }, [user])

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SelectedLayout>{children}</SelectedLayout>
    </>
  )
}

const AuthLayout = ({ children }: Props) => (
  <Grid as="article" minHeight="100%" gridTemplateRows="auto 1fr auto" gridTemplateColumns="100%">
    <Header />
    <HStack as="main" bg="#E5E5E5">
      <SidePanel />
      <VStack h="100%" p="40px">
        {children}
      </VStack>
    </HStack>
  </Grid>
)

const UnAuthLayout = ({ children }: Props) => {
  const { user, loading } = useContext(UserContext)
  const router = useRouter()

  useEffect(() => {
    if (!user && !loading && !UNAUTH_ROUTES.includes(router.route)) {
      router.push('/login')
    }
  }, [user, loading, router.route])

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
