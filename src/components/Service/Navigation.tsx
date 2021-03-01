import { useContext } from 'react'
import { Button, HStack, Box, Text, VStack, Tooltip } from '@chakra-ui/react'

import { Context } from './machine'
import { steps } from './config'

interface Props {
  step: string
}

export function Navigation({ step }: Props) {
  const { send, context } = useContext(Context) as any
  const index = steps.indexOf(step)
  const isFirst = index === 0
  const isLast = index === steps.length - 1

  // TODO: refactor this
  const handleClick = (s: string) => {
    if (context.step !== 'complete') return
    const n = steps.indexOf(s) - steps.indexOf(step)
    if (n > 0) for (let i = 0; i < n; i++) send('NEXT')
    else for (let i = 0; i < -n; i++) send('PREV')
  }

  return (
    <HStack w="full" justify="space-between">
      <Button onClick={() => send('PREV')} disabled={isFirst}>
        Prev
      </Button>
      <VStack>
        <Text fontSize="xs">
          {index + 1}/{steps.length}
        </Text>
        <StepPages current={step} onClick={handleClick} />
      </VStack>
      <Button onClick={() => send('NEXT')} disabled={isLast}>
        Next
      </Button>
    </HStack>
  )
}

interface StepPagesProps {
  current: string
  onClick: (e: string) => void
}

const StepPages = ({ current, onClick }: StepPagesProps) => (
  <HStack>
    {steps.map((s) => (
      <Tooltip key={s} hasArrow label={s} aria-label={s} shouldWrapChildren>
        <Box
          p="1"
          w="4"
          cursor="pointer"
          bg={current === s ? 'black' : 'grey'}
          onClick={() => onClick(s)}
        />
      </Tooltip>
    ))}
  </HStack>
)
