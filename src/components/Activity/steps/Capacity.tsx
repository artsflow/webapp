import { Flex, Text, Input, InputGroup, InputRightAddon, Heading } from '@chakra-ui/react'
import { useStateMachine } from 'little-state-machine'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

import { update } from '../utils'
import { Navigation } from '../Navigation'

const MIN_CAPACITY = 1
const MAX_CAPACITY = 100

export function Capacity() {
  const { state, actions } = useStateMachine({ update }) as any
  const {
    formState,
    getValues,
    formState: { errors },
    trigger,
    control,
  } = useForm({
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
            Please select the total number of spaces available for your activity.
          </Text>

          <Text fontWeight="bold" fontSize="sm">
            Select capacity
          </Text>

          <InputGroup my="4" w="160px">
            <Controller
              name="capacity"
              control={control}
              rules={{ required: true, min: MIN_CAPACITY, max: MAX_CAPACITY }}
              render={({ field }) => (
                <Input
                  autoFocus
                  type="number"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    handleChange('capacity')
                  }}
                />
              )}
            />
            <InputRightAddon children="members" />
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
