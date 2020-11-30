import { useContext } from 'react'
import { Button, HStack, Box, Text } from '@chakra-ui/core'

import { Context } from './machine'
import { steps } from './config'

interface Props {
  step: string
}

export function Navigation({ step }: Props) {
  const { send } = useContext(Context) as any
  const index = steps.indexOf(step)
  const isFirst = index === 0
  const isLast = index === steps.length - 1

  return (
    <HStack w="full" justify="space-between">
      <Button onClick={() => send('PREV')} disabled={isFirst}>
        Prev
      </Button>
      <Box>
        <Text>
          {index + 1}/{steps.length}
        </Text>
      </Box>
      <Button onClick={() => send('NEXT')} disabled={isLast}>
        Next
      </Button>
    </HStack>
  )
}
