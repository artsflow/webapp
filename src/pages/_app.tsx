import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import NProgress from 'nprogress'
import Router from 'next/router'

import { Layout } from 'components'
import { UserContext } from 'lib/context'
import { useUserData } from 'hooks'
import theme from '../theme'

import 'components/Calendar/styles.css'

NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', (url) => {
  NProgress.done()
  window.analytics?.page(url)
})
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const userData = useUserData()

  return (
    <ChakraProvider resetCSS theme={theme}>
      <UserContext.Provider value={userData}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContext.Provider>
    </ChakraProvider>
  )
}

export default MyApp
