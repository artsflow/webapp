import { useState } from 'react'
import {
  Heading,
  Text,
  Box,
  Input,
  InputGroup,
  InputLeftAddon,
  Button,
  HStack,
  VStack,
  useToast,
  Skeleton,
  Link,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import NextLink from 'next/link'

import { useAccountStatus, usePayoutsData } from 'hooks'
import { addStripeExternalAccount } from 'api'
import { Meta } from 'components'

export default function Payouts() {
  const [status, loading] = useAccountStatus()
  console.log(status)
  const isVerified = status?.verified === true
  const hasPayoutsEnabled = status?.payouts_enabled === true

  return (
    <>
      <Meta title="Payouts" />
      <Box p="40px">
        <Heading fontSize="lg" mb="1rem">
          Payouts
        </Heading>
        {isVerified && hasPayoutsEnabled && <PayoutsData />}
        {isVerified && !hasPayoutsEnabled && !loading && <AddBankAccount />}
        {!isVerified && (
          <Text as="span">
            You need to {` `}
            <NextLink href="/">
              <Link>
                <Text as="span" color="af.pink" fontWeight="bold">
                  verify your account
                </Text>
              </Link>
            </NextLink>
            {` `}in order to access the payouts
          </Text>
        )}
      </Box>
    </>
  )
}

const PayoutsData = () => {
  const [data, loading] = usePayoutsData()
  const { accounts = [] } = data
  const [acc = {}] = accounts || []

  console.log(data)

  return (
    <VStack>
      <Skeleton isLoaded={!loading} w="240px">
        <HStack fontSize="xs" color="gray.400">
          <Text>{acc.bank_name}</Text>
          <Text>{acc.routing_number}</Text>
          <Text>****{acc.last4}</Text>
        </HStack>
      </Skeleton>
    </VStack>
  )
}

const AddBankAccount = () => {
  const { register, handleSubmit, errors } = useForm({})
  const [isLoading, setLoading] = useState(false)
  const [hasBankAccount, setBankAccount] = useState(false)
  const toast = useToast()

  const onSubmit = async (data: any) => {
    setLoading(true)
    const bankAccount = await addStripeExternalAccount(data)
    setLoading(false)

    if (bankAccount?.data?.statusCode === 400) {
      console.log('ERR', bankAccount.data.raw.message)
      toast({
        title: 'Invalid banking details',
        description: bankAccount.data.raw.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top',
      })
    } else {
      toast({
        title: 'Bank details saved',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top',
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
