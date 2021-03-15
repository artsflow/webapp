import { Button, Table, Thead, Tbody, Tr, Th, Td, Icon, useDisclosure } from '@chakra-ui/react'
import { capitalize } from 'lodash'
import { rrulestr } from 'rrule'
import { format, addMinutes } from 'date-fns'
import { useStateMachine } from 'little-state-machine'

import TrashcanIcon from 'svg/icons/trashcan.svg'
import { UpcomingDates } from './UpcomingDates'

const ruleText = (r: string, duration: number) => {
  const rule = rrulestr(r)
  const from = format(rule.options.dtstart, 'HH:mm')
  const to = format(addMinutes(rule.options.dtstart, duration), 'HH:mm')
  const [freq, days] = rule.toText().replace(' for 10 times', '').split(' on ')
  return { freq, days, time: `${from} - ${to}` }
}

interface FrequencyTableProps {
  rrules: string[]
  onDelete: any
}

export const FrequencyTable = (props: FrequencyTableProps) => {
  const { state } = useStateMachine() as any
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { rrules, onDelete } = props

  return (
    <>
      <Table
        variant="simple"
        mt="1rem"
        bg="white"
        rounded="6px"
        shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
      >
        <Thead bg="#F9F9F9" shadow="none">
          <Tr>
            <Th color="#8e8e92">Repeat frequency</Th>
            <Th color="#8e8e92">Start day</Th>
            <Th color="#8e8e92">Starting time</Th>
            <Th color="#8e8e92">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rrules.map((rule: string) => {
            const { freq, days, time } = ruleText(rule, state.duration)
            return (
              <Tr key={rule}>
                <Td fontSize="xs">{capitalize(freq)}</Td>
                <Td fontSize="xs">{days}</Td>
                <Td fontSize="xs">{time}</Td>
                <Td fontSize="xs" p="0">
                  <Button
                    leftIcon={<Icon w="16px" h="16px" as={TrashcanIcon} />}
                    variant="ghost"
                    fontSize="xs"
                    color="af.pink"
                    onClick={() => onDelete(rule)}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            )
          })}
          <Tr>
            <Td colSpan={4} textAlign="center">
              <Button variant="ghost" fontSize="sm" color="af.teal" onClick={onOpen}>
                See your upcoming dates
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <UpcomingDates onClose={onClose} isOpen={isOpen} />
    </>
  )
}
