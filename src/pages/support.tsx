import React from 'react'
import { Text, Box, Heading } from '@chakra-ui/react'

import { Meta } from 'components'

export default function Support(): JSX.Element {
  return (
    <>
      <Meta title="Support" />
      <Box p="40px">
        <Heading fontSize="lg" mb="1rem">
          Get support
        </Heading>
        <Text>
          Use the chat bubble from the bottom right corner of the screen to get in contact with us.
        </Text>
      </Box>
    </>
  )
}
