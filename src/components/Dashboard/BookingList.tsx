import {
  VStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Tooltip,
  Icon,
} from '@chakra-ui/react'
import { format, fromUnixTime } from 'date-fns'

export const BookingList = ({ list }: any) => {
  if (!list || list.length === 0)
    return (
      <VStack
        bg="white"
        rounded="10px"
        boxShadow="0px 2px 6px rgba(0, 0, 0, 0.02)"
        w="full"
        spacing="0"
        py="0.5rem"
      >
        <Text fontSize="sm">no bookings yet</Text>
        <Text fontSize="xs">(copy asking user to share the activity link)</Text>
      </VStack>
    )

  return (
    <Table size="sm" bg="white" rounded="10px" boxShadow="0px 2px 6px rgba(0, 0, 0, 0.02)">
      <Thead>
        <Tr>
          <Th isNumeric>#</Th>
          <Th isNumeric>Amount</Th>
          <Th title="Pass or absorb the service fee">
            Fee
            <Tooltip hasArrow label="Pass or absorb the service fee" placement="right">
              <Icon ml="1" color="gray.500" cursor="help" boxSize="0.75rem" />
            </Tooltip>
          </Th>
          <Th>Activity date</Th>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Phone</Th>
          <Th>Booking date</Th>
        </Tr>
      </Thead>
      <Tbody>
        {list.map(
          (
            { id, amount, isFeePassed, timestamp, name, email, phone, createdAt }: any,
            i: number
          ) => (
            <Tr key={id}>
              <Td fontSize="13px" isNumeric color="gray.500">
                {list.length - i}
              </Td>
              <Td fontSize="13px" isNumeric>
                {amount ? `£${amount / 100}` : <Badge colorScheme="green">Free</Badge>}
              </Td>
              <Td fontSize="13px">{amount ? (isFeePassed ? 'pass' : 'abs') : ''}</Td>
              <Td fontSize="13px">{format(fromUnixTime(timestamp), 'dd MMM, HH:mm')}</Td>
              <Td fontSize="13px">{name}</Td>
              <Td fontSize="13px">{email}</Td>
              <Td fontSize="13px">{phone}</Td>
              <Td fontSize="13px">{format(fromUnixTime(createdAt.seconds), 'dd MMM, HH:mm')}</Td>
            </Tr>
          )
        )}
      </Tbody>
    </Table>
  )
}
