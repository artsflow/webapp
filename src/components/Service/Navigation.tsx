import { useContext } from 'react'
import { Button, HStack, Box, Text } from '@chakra-ui/core'

import { steps, Context } from './machine'

interface Props {
  step: string
}

export function Navigation({ step }: Props) {
  const { send } = useContext(Context) as any

  return (
    <HStack w="full" justify="space-between">
      <Button onClick={() => send('PREV')}>Prev</Button>
      <Box>
        <Text>
          {steps.indexOf(step) + 1}/{steps.length}
        </Text>
      </Box>
      <Button onClick={() => send('NEXT')}>Next</Button>
    </HStack>
  )
}
