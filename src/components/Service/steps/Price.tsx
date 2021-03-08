import { useContext } from 'react'

import {
  Box,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'

import { Context } from '../machine'
import { Lipsum } from '../config'

const format = (val: string) => `£${val}`
const parse = (val: string) => val.replace(/^£/, '')

export function Price() {
  const { send, context } = useContext(Context) as any
  const { price } = context

  const handleChange = (value: string) => {
    send({ type: 'UPDATE', data: { price: parse(value), meta: { isDirty: true } } })
  }

  return (
    <Box w="full">
      <Heading mb="4" size="lg">
        Price
      </Heading>
      <NumberInput
        onChange={handleChange}
        value={format(price)}
        min={5}
        max={1000}
        precision={2}
        autoFocus
      >
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
