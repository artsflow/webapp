import { Box, Input, Heading } from '@chakra-ui/core'

import { LoremIpsum } from 'lib/utils'

export function Title() {
  return (
    <Box>
      <Heading size="lg">Title</Heading>
      <Input my="4" placeholder="add service title" />
      <LoremIpsum />
    </Box>
  )
}
