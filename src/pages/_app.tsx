import { ChakraProvider } from '@chakra-ui/core'
import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import NProgress from 'nprogress'
import Router from 'next/router'

import { client } from 'services/client'
import { Layout } from 'components'
import theme from '../theme'

NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

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
