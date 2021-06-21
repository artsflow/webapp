import {
  Flex,
  Text,
  Input,
  Switch,
  InputGroup,
  FormControl,
  FormLabel,
  InputLeftAddon,
  Heading,
  useRadioGroup,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { useStateMachine } from 'little-state-machine'
import { useForm, Controller } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

import { RadioCard } from 'components'
import { update } from '../utils'
import { Navigation } from '../Navigation'

const MIN_PRICE = 5
const MAX_PRICE = 999

const ACTIVITY_TYPE = ['Free', 'Paid']
const SERVICE_FEE = 10

export function Price() {
  const { state, actions } = useStateMachine({ update }) as any
  const { monetizationType, isFeePassed, price } = state
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
  const isPaid = monetizationType === 'Paid'

  const handleChange = (field: string) => actions.update({ [field]: Number(getValues(field)) })

  const handleTrigger = async () => {
    await trigger()
  }

  const handleAbsorbFee = (ev: any) => {
    actions.update({ isFeePassed: !ev.target.checked })
  }

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'duration',
    defaultValue: monetizationType,
    onChange: (value) => {
      actions.update({ monetizationType: value })
    },
  })

  const group = getRootProps()

  const payout = isFeePassed ? price : (price - (price * SERVICE_FEE) / 100).toFixed(2)
  const userPays = isFeePassed ? (price + (price * SERVICE_FEE) / 100).toFixed(2) : price

  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-start" p="40px">
        <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" pos="relative">
          <Heading size="md" mb="1rem">
            Finally, the Price
          </Heading>
          <Text color="#616167" mb="2rem">
            Please select whether your activity is free or paid for and enter the price.
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
                <Controller
                  name="price"
                  control={control}
                  rules={{ required: isPaid, min: MIN_PRICE, max: MAX_PRICE }}
                  render={({ field }) => (
                    <Input
                      pl="4px"
                      autoFocus
                      type="number"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleChange('price')
                      }}
                    />
                  )}
                />
              </InputGroup>
              <FormControl display="flex" alignItems="center" mb="1rem">
                <Switch
                  id="absorb-fee"
                  mt="2px"
                  isChecked={!isFeePassed}
                  onChange={handleAbsorbFee}
                  colorScheme="teal"
                />
                <FormLabel htmlFor="absorb-fee" pl="1rem" mb="0" color="#616167">
                  Absorb the service fee
                </FormLabel>
              </FormControl>
              <Text color="#616167" fontSize="sm">
                {isFeePassed
                  ? 'The service fee is absorbed by the user'
                  : 'The service fee is absorbed by you'}
              </Text>
              <VStack mt="1rem" color="#616167" w="200px">
                <HStack justifyContent="space-between" w="full">
                  <Text>Service fee</Text>
                  <Text fontWeight="bold">10%</Text>
                </HStack>
                <HStack justifyContent="space-between" w="full">
                  <Text>Your payout</Text>
                  <Text fontWeight="bold">£{payout}</Text>
                </HStack>
                <HStack justifyContent="space-between" w="full" pt="1rem">
                  <Text>User pays</Text>
                  <Text fontWeight="bold">£{userPays}</Text>
                </HStack>
              </VStack>
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
