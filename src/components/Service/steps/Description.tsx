import { memo, useContext } from 'react'
import { Box, Textarea, Heading } from '@chakra-ui/core'

import { LoremIpsum } from 'lib/utils'
import { Context } from '../machine'

const Lipsum = memo(() => <LoremIpsum p={1} />)

export function Description() {
  const { send, context } = useContext(Context) as any
  const { description } = context

  const handleChange = (e: any) => {
    send({ type: 'UPDATE', data: { description: e.target.value } })
  }

  return (
    <Box>
      <Heading size="lg">Description</Heading>
      <Textarea
        my="4"
        placeholder="add description"
        rows={7}
        value={description}
        onChange={handleChange}
        autoFocus
      />
      <Lipsum />
    </Box>
  )
}
