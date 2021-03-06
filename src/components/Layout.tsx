import Head from 'next/head'
import { Grid, Box } from '@chakra-ui/react'
import { useContext } from 'react'

import { Footer, Header } from 'components'
import { UserContext } from 'lib/context'

interface Props {
  children: JSX.Element
}

export function Layout({ children }: Props) {
  const { user } = useContext(UserContext)
  const SelectedLayout = user ? AuthLayout : UnAuthLayout

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
    <Box as="main" px={[4, 32]} p="100px" pos="relative" bg="#E5E5E5">
      {children}
    </Box>
  </Grid>
)

const UnAuthLayout = ({ children }: Props) => (
  <Grid as="article" minHeight="100%" gridTemplateRows="1fr auto" gridTemplateColumns="100%">
    <Box as="main" px={[4, 32]} p="100px" pos="relative">
      {children}
    </Box>
    <Footer />
  </Grid>
)
