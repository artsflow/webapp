import { Flex, Heading, Text } from '@chakra-ui/react'
import { useStateMachine } from 'little-state-machine'

import { Navigation } from '../Navigation'
import { update } from '../utils'

export function Images() {
  const { state, actions } = useStateMachine({ update }) as any

  console.log(actions)

  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-start" p="40px">
        <Flex direction="column" alignItems="flex-start">
          <Heading size="md" mb="1rem">
            Add Images
          </Heading>
          <Text color="#616167">We recommend using your own images instead of stock images.</Text>
        </Flex>
      </Flex>
      <Navigation isValid={!!state.images.length} />
    </>
  )
}
