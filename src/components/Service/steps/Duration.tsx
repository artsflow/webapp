import { useContext } from 'react'
import {
  Box,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputRightAddon,
  InputLeftAddon,
  InputGroup,
} from '@chakra-ui/core'
import humanize from 'humanize-duration'

import { Context } from '../machine'
import { DURATION_STEP, DURATION_MIN, DURATION_MAX, Lipsum } from '../config'

export function Duration() {
  const { send, context } = useContext(Context) as any
  const { duration } = context

  const hours =
    duration >= DURATION_MIN && duration <= DURATION_MAX ? humanize(duration * 1000 * 60) : ''

  const handleChange = (_: string, value: number) => {
    send({ type: 'UPDATE', data: { duration: value } })
  }

  return (
    <Box w="full">
      <Heading mb="4" size="lg">
        Duration
      </Heading>
      <InputGroup mb="4">
        <InputLeftAddon children="minutes:" />
        <NumberInput
          onChange={handleChange}
          step={DURATION_STEP}
          defaultValue={duration}
          min={DURATION_MIN}
          max={DURATION_MAX}
          allowMouseWheel
          w="80px"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <InputRightAddon children={hours} w="180px" />
      </InputGroup>
      <Lipsum />
    </Box>
  )
}
