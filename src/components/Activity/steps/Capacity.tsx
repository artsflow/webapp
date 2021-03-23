import { Flex, Text, Input, InputGroup, InputRightAddon, Heading } from '@chakra-ui/react'
import { useStateMachine } from 'little-state-machine'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

import { update } from '../utils'
import { Navigation } from '../Navigation'

const MIN_CAPACITY = 1
const MAX_CAPACITY = 100

export function Capacity() {
  const { state, actions } = useStateMachine({ update }) as any
  const { register, formState, getValues, errors, trigger } = useForm({
    defaultValues: state,
    mode: 'onBlur',
  })
  const { isValid } = formState

  const handleChange = (field: string) => actions.update({ [field]: Number(getValues(field)) })

  const handleTrigger = async () => {
    await trigger()
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-start" p="40px">
        <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" pos="relative">
          <Heading size="md" mb="1rem">
            Capacity
          </Heading>
          <Text color="#616167" mb="2rem">
            How many members can attend to your activity.
          </Text>

          <Text fontWeight="bold" fontSize="sm">
            Select capacity
          </Text>

          <InputGroup
            my="4"
            bg="white"
            border="1px solid white"
            shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
            w="160px"
            rounded="6px"
          >
            <Input
              autoFocus
              type="number"
              ref={register({
                required: true,
                min: MIN_CAPACITY,
                max: MAX_CAPACITY,
              })}
              onChange={() => handleChange('capacity')}
              name="capacity"
            />
            <InputRightAddon bg="white" children="members" />
          </InputGroup>
          <Error
            errors={errors}
            name="capacity"
            message={`Capacity between ${MIN_CAPACITY} and ${MAX_CAPACITY} members`}
          />
        </Flex>
      </Flex>
      <Navigation isValid={isValid} onClick={handleTrigger} />
    </>
  )
}

const Error = (props: any) => (
  <ErrorMessage as={<Text color="red.400" fontSize="xs" bottom="0" right="0" />} {...props} />
)
