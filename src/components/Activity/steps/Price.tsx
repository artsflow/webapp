import {
  Flex,
  Text,
  Input,
  InputGroup,
  InputLeftAddon,
  Heading,
  useRadioGroup,
} from '@chakra-ui/react'
import { useStateMachine } from 'little-state-machine'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

import { RadioCard } from 'components'
import { update } from '../utils'
import { Navigation } from '../Navigation'

const MIN_PRICE = 5
const MAX_PRICE = 999

const ACTIVITY_TYPE = ['Free', 'Paid']

export function Price() {
  const { state, actions } = useStateMachine({ update }) as any
  const { type } = state
  const { register, formState, getValues, errors, trigger } = useForm({
    defaultValues: state,
    mode: 'onBlur',
  })
  const { isValid } = formState
  const isPaid = type === 'Paid'

  const handleChange = (field: string) => actions.update({ [field]: Number(getValues(field)) })

  const handleTrigger = async () => {
    await trigger()
  }

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'duration',
    defaultValue: type,
    onChange: (value) => {
      actions.update({ type: value })
    },
  })

  const group = getRootProps()

  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-start" p="40px">
        <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" pos="relative">
          <Heading size="md" mb="1rem">
            Finally, the Price
          </Heading>
          <Text color="#616167" mb="2rem">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
          </Text>
          <Text fontWeight="bold" fontSize="sm">
            Activity Type
          </Text>

          <Flex {...group} mt="1rem" wrap="wrap" mb="1rem">
            {ACTIVITY_TYPE.map((value) => {
              const radio = getRadioProps({ value })
              return (
                <RadioCard key={value} {...radio}>
                  {value}
                </RadioCard>
              )
            })}
          </Flex>
          {isPaid && (
            <>
              <Text fontWeight="bold" fontSize="sm">
                Activity Price
              </Text>
              <InputGroup
                my="4"
                bg="white"
                border="1px solid white"
                shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
                w="120px"
                rounded="6px"
              >
                <InputLeftAddon bg="white" pr="4px" children="£" />
                <Input
                  pl="4px"
                  autoFocus
                  type="number"
                  ref={register({
                    required: isPaid,
                    min: MIN_PRICE,
                    max: MAX_PRICE,
                    valueAsNumber: true,
                  })}
                  onChange={() => handleChange('price')}
                  name="price"
                />
              </InputGroup>
              <Error
                errors={errors}
                name="price"
                message={`Pirce between £${MIN_PRICE} and £${MAX_PRICE}`}
              />
            </>
          )}
        </Flex>
      </Flex>
      <Navigation isValid={isValid} onClick={handleTrigger} />
    </>
  )
}

const Error = (props: any) => (
  <ErrorMessage as={<Text color="red.400" fontSize="xs" bottom="0" right="0" />} {...props} />
)