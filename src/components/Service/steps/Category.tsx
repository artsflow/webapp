import { useContext } from 'react'
import { HStack, Box, Heading, useRadioGroup } from '@chakra-ui/react'

import { RadioCard } from 'components'
import { Lipsum } from '../config'
import { Context } from '../machine'

const CATEGORIES = ['visual', 'music', 'crafts', 'performing', 'other']

export function Category() {
  const { send, context } = useContext(Context) as any
  const { category } = context

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'category',
    defaultValue: category,
    onChange: (c) => send({ type: 'UPDATE', data: { category: c, meta: { isDirty: true } } }),
  })

  const group = getRootProps()

  return (
    <Box>
      <Heading size="lg">Art category</Heading>
      <Lipsum />
      <HStack margin="0 auto" mt="8" spacing="4" {...group} wrap="wrap" w="60%">
        {CATEGORIES.map((value) => {
          const radio = getRadioProps({ value })
          return (
            <RadioCard key={value} {...radio}>
              {value}
            </RadioCard>
          )
        })}
      </HStack>
    </Box>
  )
}
