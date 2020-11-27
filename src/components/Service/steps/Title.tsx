import { memo, useContext } from 'react'
import { Box, Input, InputGroup, InputRightElement, Heading } from '@chakra-ui/core'

import { LoremIpsum } from 'lib/utils'
import { Context } from '../machine'
import { TITLE_LENGTH } from '../config'

const Lipsum = memo(() => <LoremIpsum />)

export function Title() {
  const { send, context } = useContext(Context) as any
  const { title } = context

  const handleChange = (e: any) => {
    send({ type: 'UPDATE', data: { title: e.target.value.substr(0, TITLE_LENGTH) } })
  }

  return (
    <Box>
      <Heading size="lg">Title</Heading>
      <InputGroup>
        <Input
          my="4"
          pr="60px"
          placeholder="add service title"
          value={title}
          onChange={handleChange}
          autoFocus
        />
        <InputRightElement
          my="4"
          mr="2"
          fontSize="xs"
          color="grey.300"
          children={`${title.length}/${TITLE_LENGTH}`}
        />
      </InputGroup>
      <Lipsum />
    </Box>
  )
}
