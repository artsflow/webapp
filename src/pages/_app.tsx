import { ChakraProvider } from '@chakra-ui/core'

import { AppProps } from 'next/app'
import theme from '../theme'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
