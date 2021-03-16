import { Flex, Heading, useRadioGroup, Text } from '@chakra-ui/react'
import { useStateMachine } from 'little-state-machine'

import { RadioCard } from 'components'
import { Navigation } from '../Navigation'
import { update } from '../utils'

const CATEGORIES = [
  'Visual Art',
  'Sculpture',
  'Ceramics',
  'Music',
  'Drama',
  'Performing Arts',
  'Crafts',
  'Illustration',
  'Dancing',
  'Circus Arts',
  'Photography',
  'Film',
  'Other',
]

export function Category() {
  const { state, actions } = useStateMachine({ update }) as any

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'category',
    defaultValue: state.category,
    onChange: (category) => actions.update({ category }),
  })

  const group = getRootProps()

  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-start" p="40px">
        <Flex direction="column" alignItems="flex-start">
          <Heading size="md" mb="1rem">
            Select Category
          </Heading>
          <Text color="#616167" mb="2rem">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
          </Text>
          <Text fontWeight="bold" fontSize="sm">
            Choose a category
          </Text>
          <Flex {...group} mt="4" wrap="wrap" maxW="600px">
            {CATEGORIES.map((value) => {
              const radio = getRadioProps({ value })
              return (
                <RadioCard key={value} {...radio}>
                  {value}
                </RadioCard>
              )
            })}
          </Flex>
        </Flex>
      </Flex>
      <Navigation isValid={!!state.category} />
    </>
  )
}
