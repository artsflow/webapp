import { useEffect } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import NProgress from 'nprogress'
import Router from 'next/router'
import Cohere from 'cohere-js'

import { Layout } from 'components'
import { UserContext } from 'lib/context'
import { useUserData } from 'hooks'
import { COHERE_KEY } from 'lib/config'
import theme from '../theme'

import 'components/Calendar/styles.css'
import 'components/Newsletters/styles.css'

NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', (url) => {
  NProgress.done()
  window.analytics?.page(url)
})
Router.events.on('routeChangeError', () => NProgress.done())

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const userData = useUserData()

  useEffect(() => {
    Cohere.init(COHERE_KEY)
  }, [])

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
