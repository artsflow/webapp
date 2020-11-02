import Head from 'next/head'
import { useRouter } from 'next/router'

import { SITE_URL } from 'lib/config'

const defaultDescription = 'Artsflow'

interface Props {
  title: string
  description?: string
  url?: string
}

export function Meta({ title, description, url }: Props) {
  const router = useRouter()
  const pageUrl = `${SITE_URL}${router.asPath}`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:site_name" content="Artsflow" />
      <meta property="og:url" content={url || pageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/icon-512x512.png" />
    </Head>
  )
}

Meta.defaultProps = {
  description: defaultDescription,
  url: '',
}
