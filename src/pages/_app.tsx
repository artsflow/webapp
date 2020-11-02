import { ChakraProvider } from '@chakra-ui/core'
import { AppProps } from 'next/app'

import { Layout } from 'components'
import theme from '../theme'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <ChakraProvider resetCSS theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </>
  )
}

export default MyApp
