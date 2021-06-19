import { Box } from '@chakra-ui/react'

import { Meta } from 'components'
import { MD } from 'lib/utils'

// import content from 'content/terms.md'

export default function Terms({ content }: any): JSX.Element {
  return (
    <>
      <Meta title="Terms and conditions | Artsflow" />
      <Box p="40px" maxW="800px">
        {MD(content)}
      </Box>
    </>
  )
}

export async function getStaticProps() {
  // @ts-ignore
  const content = await import(`content/terms.md`)
  return {
    props: {
      content: content.default,
    },
  }
}
