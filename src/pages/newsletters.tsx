import React from 'react'
import { Box, Heading } from '@chakra-ui/react'

import { Meta, Newsletters } from 'components'

export default function NewslettersPage(): JSX.Element {
  return (
    <>
      <Meta title="Newsletters" />
      <Box p="40px" w="full">
        <Heading fontSize="1.5rem" mb="1.5rem">
          Newsletters
        </Heading>
        <Newsletters />
      </Box>
    </>
  )
}
