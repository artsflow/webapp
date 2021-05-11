import { Box, Flex, HStack, VStack, Heading, useRadioGroup, Text, Input } from '@chakra-ui/react'
import { useStateMachine } from 'little-state-machine'
import { useForm } from 'react-hook-form'

import { RadioCard } from 'components'
import { Navigation } from '../Navigation'
import { update } from '../utils'

export function Options() {
  const { state, actions } = useStateMachine({ update }) as any

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'activityType',
    value: state.activityType,
    onChange: (activityType) => actions.update({ activityType }),
  })

  const group = getRootProps()

  const isValid = true

  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-start" p="40px">
        <Flex direction="column" alignItems="flex-start">
          <Heading size="md" mb="1rem">
            What would you like to create?
          </Heading>
          <Text color="#616167" mb="2rem">
            Please select whether you’d like to create an activity or event.
          </Text>

          <HStack {...group} mt="4" wrap="wrap" spacing="2rem">
            {['Activity', 'Other Event'].map((value, i) => {
              const radio = getRadioProps({ value })
              return (
                <VStack
                  key={value}
                  p="1.5rem"
                  bg="white"
                  rounded="12px"
                  maxW="300px"
                  spacing="1.5rem"
                >
                  <Heading as="h4" fontSize="sm">
                    Select {value}
                  </Heading>
                  <Text textAlign="center" fontSize="sm" color="gray.500">
                    {i === 0
                      ? `An activity is delivered to a person or group of people, typically on a regular basis. For e.g. Music sessions delivered at a village hall.`
                      : `An event is organised for a large group of people, typically on a annual basis. For e.g. An arts festival held in the local community`}
                  </Text>
                  <RadioCard {...radio}>{value}</RadioCard>
                </VStack>
              )
            })}
          </HStack>
          <ActivityPresence />
          <AudienceType />
          <AudienceLevel />
        </Flex>
      </Flex>
      <Navigation isValid={isValid} />
    </>
  )
}

const ActivityPresence = () => {
  const { state, actions } = useStateMachine({ update }) as any
  const { register, getValues } = useForm({
    defaultValues: state,
    mode: 'onBlur',
  })

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'categoryType',
    value: state.activityPresence,
    onChange: (activityPresence) => actions.update({ activityPresence }),
  })

  const group = getRootProps()

  const isOnline = state.activityPresence === 'Online'

  return (
    <Box mt="2rem">
      <Text fontWeight="bold" fontSize="sm">
        Is this online or in person?
      </Text>
      <HStack>
        <Flex {...group} mt="4" wrap="wrap" w="380px">
          {['In Person', 'Online'].map((value) => {
            const radio = getRadioProps({ value })
            return (
              <RadioCard key={value} {...radio}>
                {value}
              </RadioCard>
            )
          })}
        </Flex>
        <Input
          display={isOnline ? 'block' : 'none'}
          my="4"
          pr="60px"
          placeholder="https://"
          bg="white"
          border="none"
          shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
          autoFocus
          name="presenceUrl"
          ref={register({
            required: false,
          })}
          onChange={() => actions.update({ presenceUrl: getValues('presenceUrl') })}
        />
      </HStack>
    </Box>
  )
}

const AudienceType = () => {
  const { state, actions } = useStateMachine({ update }) as any

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'audienceType',
    value: state.audienceType,
    onChange: (audienceType) => actions.update({ audienceType }),
  })

  const group = getRootProps()

  return (
    <Box mt="2rem">
      <Text fontWeight="bold" fontSize="sm">
        Who is this suitable for?
      </Text>
      <Flex {...group} mt="4" wrap="wrap" maxW="600px">
        {['Toddlers', 'Children', 'Adults', 'Elderly'].map((value) => {
          const radio = getRadioProps({ value })
          return (
            <RadioCard key={value} {...radio}>
              {value}
            </RadioCard>
          )
        })}
      </Flex>
    </Box>
  )
}

const AudienceLevel = () => {
  const { state, actions } = useStateMachine({ update }) as any

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'audienceType',
    value: state.audienceLevel,
    onChange: (audienceLevel) => actions.update({ audienceLevel }),
  })

  const group = getRootProps()

  return (
    <Box mt="2rem">
      <Text fontWeight="bold" fontSize="sm">
        What level is your audience?
      </Text>
      <Flex {...group} mt="4" wrap="wrap" maxW="600px">
        {['Beginners', 'Intermediate', 'Advanced'].map((value) => {
          const radio = getRadioProps({ value })
          return (
            <RadioCard key={value} {...radio}>
              {value}
            </RadioCard>
          )
        })}
      </Flex>
    </Box>
  )
}
