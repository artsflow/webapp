import Head from 'next/head'
import { Grid, Box } from '@chakra-ui/react'

import { Footer, Header } from 'components'

interface Props {
  children: JSX.Element
}

export function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Grid
        as="article"
        minHeight="100%"
        gridTemplateRows="auto 1fr auto"
        gridTemplateColumns="100%"
      >
        <Header />
        <Box as="main" px={[4, 32]} p="100px" pos="relative">
          {children}
        </Box>
        <Footer />
      </Grid>
    </>
  )
}
