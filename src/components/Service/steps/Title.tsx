import { memo, useContext } from 'react'
import { Box, Input, Heading } from '@chakra-ui/core'

import { LoremIpsum } from 'lib/utils'
import { Context } from '../machine'

const Lipsum = memo(() => <LoremIpsum />)

export function Title() {
  const { send, context } = useContext(Context) as any
  const { title } = context

  const handleChange = (e: any) => {
    send({ type: 'UPDATE', data: { title: e.target.value } })
  }

  return (
    <Box>
      <Heading size="lg">Title</Heading>
      <Input
        my="4"
        placeholder="add service title"
        value={title}
        onChange={handleChange}
        autoFocus
      />
      <Lipsum />
    </Box>
  )
}
