import { useState } from 'react'
import { Text, Input, InputGroup, InputLeftAddon, Button, HStack, VStack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

import { addStripeExternalAccount } from 'api'
import { showAlert } from 'lib/utils'

export const AddBankAccount = () => {
  const { register, handleSubmit, errors } = useForm({})
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
    }
  }

  if (hasBankAccount) return null

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack alignItems="flex-start" pos="relative" spacing="1rem">
        <Text fontSize="sm">Please add the bank account:</Text>
        <HStack>
          <InputGroup
            bg="white"
            border="1px solid white"
            shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
            rounded="6px"
            w="220px"
          >
            <InputLeftAddon w="100px" bg="white" children="Sort code" />
            <Input
              autoFocus
              placeholder="12-34-56"
              ref={register({
                required: true,
                pattern: /(?!0{2}(-?0{2}){2})(\d{2}(-\d{2}){2})|(\d{6})/,
                setValueAs: (value) => value.replaceAll('-', ''),
              })}
              name="sortcode"
            />
          </InputGroup>
          <Error errors={errors} name="sortcode" message="Invalid sort code" />
        </HStack>
        <HStack>
          <InputGroup
            bg="white"
            border="1px solid white"
            shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
            rounded="6px"
            w="220px"
          >
            <InputLeftAddon w="100px" bg="white" children="Account" />
            <Input
              placeholder="123456789"
              ref={register({
                required: true,
                minLength: 6,
                maxLength: 9,
                pattern: /^[0-9]*$/,
              })}
              name="account"
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
