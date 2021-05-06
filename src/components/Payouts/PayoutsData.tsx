import { Text, HStack, Skeleton, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react'
import { format, fromUnixTime } from 'date-fns'

import { usePayoutsData } from 'hooks'

export const PayoutsData = () => {
  const [data = {}, loading] = usePayoutsData()
  const { accounts = [], list = {} } = data
  const [acc = {}] = accounts

  return (
    <>
      <Skeleton isLoaded={!loading} w="240px">
        <HStack fontSize="xs" color="gray.400" mb="1rem">
          <Text>{acc.bank_name}</Text>
          <Text>{acc.routing_number}</Text>
          <Text>****{acc.last4}</Text>
        </HStack>
      </Skeleton>
      <PayoutsList {...list} />
    </>
  )
}

const PayoutsList = ({ data }: any) => {
  if (!data) return null
  return (
    <Table bg="white" rounded="10px">
      <Thead>
        <Tr>
          <Th isNumeric>Amount</Th>
          <Th>Statement desc.</Th>
          <Th>Status</Th>
          <Th>Initiated</Th>
          <Th>Est. arrival</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((payout: any) => (
          <Tr key={payout.id}>
            <Td isNumeric>£{payout.amount / 100}</Td>
            <Td>{payout.statement_descriptor}</Td>
            <Td>{payout.status}</Td>
            <Td>{format(fromUnixTime(payout.created), 'dd MMM, HH:mm')}</Td>
            <Td>{format(fromUnixTime(payout.arrival_date), 'dd MMM')}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}
