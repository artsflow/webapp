import { useContext } from 'react'
import { Box, Textarea, InputGroup, InputRightElement, Heading } from '@chakra-ui/core'

import { Context } from '../machine'
import { DESCRIPTION_LENGTH, Lipsum } from '../config'

export function Description() {
  const { send, context } = useContext(Context) as any
  const { description } = context
  console.log(context)

  const handleChange = (e: any) => {
    send({
      type: 'UPDATE',
      data: { description: e.target.value.substr(0, DESCRIPTION_LENGTH), meta: { isDirty: true } },
    })
  }

  return (
    <Box>
      <Heading size="lg">Description</Heading>
      <InputGroup>
        <Textarea
          my="4"
          placeholder="add description"
          rows={7}
          value={description}
          onChange={handleChange}
          autoFocus
        />
        <InputRightElement
          mt="-16px"
          mr="3px"
          w="80px"
          fontSize="xs"
          color="grey.300"
          children={`${description.length}/${DESCRIPTION_LENGTH}`}
        />
      </InputGroup>
      <Lipsum />
    </Box>
  )
}
