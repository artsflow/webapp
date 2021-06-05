import { useState } from 'react'
import { Text, Input, InputGroup, InputLeftAddon, Button, HStack, VStack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

import { addStripeExternalAccount } from 'api'
import { showAlert } from 'lib/utils'
import { trackUpdateBankAccount } from 'analytics'

export const AddBankAccount = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({})
  const [isLoading, setLoading] = useState(false)
  const [hasBankAccount, setBankAccount] = useState(false)

  const onSubmit = async (data: any) => {
    setLoading(true)
    const bankAccount = await addStripeExternalAccount(data)
    setLoading(false)

    if (bankAccount?.data?.statusCode === 400) {
      showAlert({
        title: 'Invalid banking details',
        description: bankAccount.data.raw.message,
        status: 'error',
      })
    } else {
      showAlert({
        title: 'Bank details saved',
        status: 'success',
      })
      setBankAccount(true)
      trackUpdateBankAccount()
    }
  }

  if (hasBankAccount) return null

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack alignItems="flex-start" pos="relative" spacing="1rem">
        <Text fontSize="sm">Please add the bank account:</Text>
        <HStack>
          <InputGroup bg="white" rounded="6px" w="220px">
            <InputLeftAddon w="100px" bg="white" children="Sort code" />
            <Input
              autoFocus
              placeholder="12-34-56"
              {...register('sortcode', {
                required: true,
                pattern: /(?!0{2}(-?0{2}){2})(\d{2}(-\d{2}){2})|(\d{6})/,
                setValueAs: (value) => value.replaceAll('-', ''),
              })}
            />
          </InputGroup>
          <Error errors={errors} name="sortcode" message="Invalid sort code" />
        </HStack>
        <HStack>
          <InputGroup bg="white" rounded="6px" w="220px">
            <InputLeftAddon w="100px" bg="white" children="Account" />
            <Input
              placeholder="123456789"
              {...register('account', {
                required: true,
                minLength: 6,
                maxLength: 9,
                pattern: /^[0-9]*$/,
              })}
            />
          </InputGroup>
          <Error errors={errors} name="account" message="Invalid account number" />
        </HStack>
        <Button bg="af.teal" type="submit" color="white" isLoading={isLoading}>
          Save account details
        </Button>
      </VStack>
    </form>
  )
}

const Error = (props: any) => (
  <ErrorMessage as={<Text color="red.400" fontSize="xs" w="200px" />} {...props} />
)
