import { ChakraProvider } from '@chakra-ui/core'
import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'

import { client } from 'services/client'
import { Layout } from 'components'
import theme from '../theme'

export const fetcher = (query: string) => client.request(query)

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        fetcher,
      }}
    >
      <ChakraProvider resetCSS theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </SWRConfig>
  )
}

export default MyApp
