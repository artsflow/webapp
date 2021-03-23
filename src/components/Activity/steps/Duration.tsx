import React, { useState } from 'react'

import {
  Flex,
  Heading,
  useRadioGroup,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputRightAddon,
  InputGroup,
} from '@chakra-ui/react'
import { useStateMachine } from 'little-state-machine'
import humanize from 'humanize-duration'

import { RadioCard } from 'components'
import { Navigation } from '../Navigation'
import { update } from '../utils'

const DURATIONS = ['15', '30', '60', '120', 'custom']
const DURATUION_TEXT = {
  15: '15 minutes',
  30: '30 minutes',
  60: '1 hour',
  120: '2 hours',
  custom: 'Custom',
} as any

const DURATION_STEP = 15
const DURATION_MIN = 15
const DURATION_MAX = 360

export function Duration() {
  const { state, actions } = useStateMachine({ update }) as any
  const { duration } = state
  const [isCustom, setCustom] = useState(!DURATIONS.includes(duration.toString()) && !!duration)
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'duration',
    defaultValue:
      DURATIONS.includes(duration.toString()) || duration === 0 ? duration.toString() : 'custom',
    onChange: (value) => {
      if (value === 'custom') {
        setCustom(true)
      } else {
        setCustom(false)
        actions.update({ duration: Number(value) })
      }
    },
  })

  const group = getRootProps()

  const handleChange = (_: string, value: number) => {
    actions.update({ duration: value })
  }

  const hours =
    duration >= DURATION_MIN && duration <= DURATION_MAX ? humanize(duration * 1000 * 60) : ''

  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-start" p="40px">
        <Flex direction="column" alignItems="flex-start">
          <Heading size="md" mb="1rem">
            Duration
          </Heading>
          <Text color="#616167">Set your activity duration.</Text>
          <Heading pt="2rem" fontSize="md">
            Select duration
          </Heading>
          <Flex {...group} mt="1rem" wrap="wrap" maxW="600px">
            {DURATIONS.map((value) => {
              const radio = getRadioProps({ value })
              return (
                <RadioCard key={value} {...radio}>
                  {DURATUION_TEXT[value]}
                </RadioCard>
              )
            })}
          </Flex>

          {isCustom && (
            <>
              <Heading py="1rem" pb="1rem" fontSize="md">
                Custom duration
              </Heading>
              <InputGroup mb="4">
                <NumberInput
                  onChange={handleChange}
                  step={DURATION_STEP}
                  value={duration}
                  min={DURATION_MIN}
                  max={DURATION_MAX}
                  allowMouseWheel
                  w="80px"
                  bg="white"
                  border="white"
                  rounded="6px"
                  shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <InputRightAddon children={hours} w="180px" border="none" bg="#F9F9F9" />
              </InputGroup>
            </>
          )}
        </Flex>
      </Flex>
      <Navigation isValid={!!state.duration} />
    </>
  )
}
