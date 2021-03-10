import { Flex, Heading, useRadioGroup, Text } from '@chakra-ui/react'

import { RadioCard } from 'components'

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
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'category',
    defaultValue: 'visual',
    onChange: (c) => console.log(c),
  })

  const group = getRootProps()

  return (
    <Flex justifyContent="space-between" alignItems="flex-start" p="40px">
      <Flex direction="column" alignItems="flex-start">
        <Heading size="md" mb="1rem">
          Select Category
        </Heading>
        <Text color="#616167">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </Text>
        <Heading pt="2rem" pb="0.5rem" fontSize="md">
          Choose a category
        </Heading>
        <Flex {...group} mt="8" wrap="wrap" maxW="600px">
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
  )
}
