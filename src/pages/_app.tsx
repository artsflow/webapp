import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import NProgress from 'nprogress'
import Router from 'next/router'
import FullStory from 'react-fullstory'

import { Layout } from 'components'
import { UserContext } from 'lib/context'
import { FULLSTORY_ORG } from 'lib/config'
import { useUserData } from 'hooks'
import { isProd } from 'lib/utils'
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

  return (
    <ChakraProvider resetCSS theme={theme}>
      <UserContext.Provider value={userData}>
        {isProd && <FullStory org={FULLSTORY_ORG} />}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContext.Provider>
    </ChakraProvider>
  )
}

export default MyApp
