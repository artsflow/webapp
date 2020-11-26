import { Box, Textarea, Heading } from '@chakra-ui/core'

import { LoremIpsum } from 'lib/utils'

export function Description() {
  return (
    <Box>
      <Heading size="lg">Description</Heading>
      <Textarea my="4" placeholder="add description" rows={7} />
      <LoremIpsum p={1} />
    </Box>
  )
}
