import { memo, useContext } from 'react'
import { HStack, Box, Heading, useRadioGroup } from '@chakra-ui/core'

import { RadioCard } from 'components'
import { LoremIpsum } from 'lib/utils'
import { Context } from '../machine'

const CATEGORIES = ['visual', 'music', 'crafts', 'performing', 'other']

const Lipsum = memo(() => <LoremIpsum p={1} />)

export function Category() {
  const { send, context } = useContext(Context) as any
  const { category } = context

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'category',
    defaultValue: category,
    onChange: (c) => send({ type: 'UPDATE', data: { category: c } }),
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
