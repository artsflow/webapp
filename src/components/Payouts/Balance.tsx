import { Text, HStack, Skeleton } from '@chakra-ui/react'

import { useBalance } from 'hooks'

export const Balance = () => {
  const [balance = {}, loading] = useBalance()
  const { available, pending } = balance

  return (
    <HStack mt="1rem">
      <Text>Avilable balance: </Text>
      <Skeleton isLoaded={!loading} as={HStack}>
        <Text fontWeight="bold">£{available?.[0].amount / 100}</Text>
        <Text> (pending £{pending?.[0].amount / 100})</Text>
      </Skeleton>
    </HStack>
  )
}
