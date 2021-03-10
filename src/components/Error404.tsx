import { Heading } from '@chakra-ui/react'

import { Meta } from 'components'

export function Error404() {
  return (
    <>
      <Meta title="Error 404" description="Page not found" />
      <Heading fontSize="md" align="center" mt="8">
        Error 404 - Page not found
      </Heading>
    </>
  )
}
