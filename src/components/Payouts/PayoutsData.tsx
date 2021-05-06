import { Text, HStack, VStack, Skeleton } from '@chakra-ui/react'

import { usePayoutsData } from 'hooks'

export const PayoutsData = () => {
  const [data = {}, loading] = usePayoutsData()
  const { accounts = [], list = {} } = data
  const [acc = {}] = accounts

  console.log(data, list)

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
