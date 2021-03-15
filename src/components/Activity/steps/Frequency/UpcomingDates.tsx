import {
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { SmallAddIcon, SmallCloseIcon } from '@chakra-ui/icons'
import { useStateMachine } from 'little-state-machine'
import { RRuleSet, rrulestr } from 'rrule'
import { format } from 'date-fns'

import { update } from 'components/Activity/utils'

export interface FrequencyRules {
  rrules: string[]
  exdate: string[]
}

export const UpcomingDates = ({ onClose, isOpen }: any) => {
  const { state, actions } = useStateMachine({ update }) as any
  const { frequency } = state
  const { rrules, exdate } = frequency as FrequencyRules
  const rruleSet = new RRuleSet()
  rrules.forEach((r: string) => rruleSet.rrule(rrulestr(r)))

  const toggleExDate = (d: string) => {
    const isExcluded = exdate.includes(d)
    actions.update({
      frequency: {
        rrules,
        exdate: isExcluded ? exdate.filter((e) => e !== d) : [...exdate, d],
      },
    })
  }

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upcoming activity dates</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex h="60vh" overflow="scroll">
            <Table
              variant="simple"
              mt="1rem"
              bg="white"
              rounded="6px"
              shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
            >
              <Thead bg="#F9F9F9">
                <Tr>
                  <Th color="#8e8e92">Weekday</Th>
                  <Th color="#8e8e92">Date</Th>
                  <Th color="#8e8e92">Time</Th>
                  <Th color="#8e8e92" isNumeric>
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {rruleSet.all().map((d) => {
                  const isExcluded = exdate.includes(d.toString())
                  return (
                    <Tr key={d.toString()} color={isExcluded ? 'gray.300' : 'black'}>
                      <Td fontSize="xs">{format(d, 'EEEE')}</Td>
                      <Td fontSize="xs">{format(d, 'dd MMMM yyyy')}</Td>
                      <Td fontSize="xs">{format(d, 'HH:mm')}</Td>
                      <Td fontSize="xs" p="0" isNumeric>
                        <Button
                          leftIcon={<Icon as={isExcluded ? SmallAddIcon : SmallCloseIcon} />}
                          variant="ghost"
                          fontSize="xs"
                          color={isExcluded ? 'af.teal' : 'af.pink'}
                          mr="1rem"
                          onClick={() => toggleExDate(d.toString())}
                        >
                          {isExcluded ? 'Include' : 'Exclude'}
                        </Button>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
