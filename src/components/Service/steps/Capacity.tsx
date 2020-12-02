import { useContext } from 'react'

import {
  Box,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/core'

import { Context } from '../machine'
import { Lipsum } from '../config'

export function Capacity() {
  const { send, context } = useContext(Context) as any
  const { capacity } = context

  const handleChange = (_: string, value: number) => {
    send({ type: 'UPDATE', data: { capacity: value, meta: { isDirty: true } } })
  }

  return (
    <Box w="full">
      <Heading mb="4" size="lg">
        Capacity
      </Heading>
      <NumberInput onChange={handleChange} defaultValue={capacity} min={1} max={30}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Lipsum />
    </Box>
  )
}
