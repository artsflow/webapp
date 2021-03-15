import React, { useState, useEffect } from 'react'

import {
  Flex,
  Heading,
  Text,
  HStack,
  Input,
  VStack,
  useCheckboxGroup,
  CheckboxGroup,
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
  useDisclosure,
} from '@chakra-ui/react'
import Select from 'react-select'
import { SmallAddIcon, SmallCloseIcon } from '@chakra-ui/icons'

import { useStateMachine } from 'little-state-machine'
import { isEmpty, uniq, difference, capitalize } from 'lodash'
import { RRule, RRuleSet, Weekday, rrulestr } from 'rrule'
import { getDate, getMonth, getYear, format } from 'date-fns'

import TrashcanIcon from 'svg/icons/trashcan.svg'
import { CheckboxCard } from 'components'
import { Navigation } from '../Navigation'
import { update } from '../utils'

const weekDaysMap: Record<string, Weekday> = {
  Mon: RRule.MO,
  Tue: RRule.TU,
  Wed: RRule.WE,
  Thu: RRule.TH,
  Fri: RRule.FR,
  Sat: RRule.SA,
  Sun: RRule.SU,
}

const repeatOptions = [
  { value: 1, label: 'Every week' },
  { value: 2, label: 'Every 2 weeks' },
  { value: 3, label: 'Every 3 wekees' },
  { value: 4, label: 'Every month' },
]

interface InternalState {
  days: string[]
  time: string
  interval: number
}

interface FrequencyRules {
  rrules: string[]
  exdate: string[]
}

const initalState: InternalState = {
  days: [],
  time: '',
  interval: 1,
}

export function Frequency() {
  const { state, actions } = useStateMachine({ update }) as any
  const { frequency } = state
  const { rrules, exdate } = frequency as FrequencyRules
  const [internalState, setInternalState] = useState(initalState)
  const { days, interval, time } = internalState

  console.log(internalState)
  const isDisabled = !days.length || !time

  const handleAddRule = () => {
    const now = new Date()
    const day = getDate(now)
    const month = getMonth(now)
    const year = getYear(now)
    const [hh, mm] = time.split(':')
    const dtstart = new Date(Date.UTC(year, month, day, +hh, +mm, 0))

    const rule = new RRule({
      byweekday: days.map((d) => weekDaysMap[d]),
      freq: RRule.WEEKLY,
      interval,
      dtstart,
      count: 10,
    })

    actions.update({
      frequency: {
        rrules: uniq([...rrules, rule.toString()]),
        exdate,
      },
    })
  }

  const handleDelete = (r: string) => {
    actions.update({
      frequency: {
        rrules: rrules.filter((e: string) => e !== r),
        exdate: difference(
          exdate,
          rrulestr(r)
            .all()
            .map((e) => e.toString())
        ),
      },
    })
  }

  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-start" p="40px">
        <Flex direction="column" alignItems="flex-start">
          <Heading size="md" mb="1rem">
            Frequency
          </Heading>
          <Text color="#616167">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
          </Text>
          <HStack my="2rem">
            <VStack alignItems="flexStart">
              <Text fontSize="xs" fontWeight="bold">
                Repeat frequency
              </Text>
              <Select
                components={{
                  IndicatorSeparator: () => null,
                }}
                styles={{
                  control: (base, { isFocused }) => ({
                    ...base,
                    border: '0px',
                    padding: '5px',
                    boxShadow: isFocused
                      ? '0px 0px 0px 1px #47BCC8'
                      : '0px 3px 8px rgba(50, 50, 71, 0.05)',
                    width: '200px',
                  }),
                  menu: (base) => ({
                    ...base,
                    boxShadow: '0px 3px 8px rgba(50, 50, 71, 0.05)',
                  }),
                }}
                options={repeatOptions}
                defaultValue={repeatOptions[0]}
                onChange={(o: any) => setInternalState({ ...internalState, interval: o.value })}
              />
            </VStack>
            <VStack alignItems="flexStart">
              <Text fontSize="xs" fontWeight="bold">
                Starting at
              </Text>
              <Input
                type="time"
                w="28"
                value={internalState.time}
                onChange={(e) => setInternalState({ ...internalState, time: e.target.value })}
                bg="white"
                border="none"
                shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
                h="46px"
              />
            </VStack>
          </HStack>
          <Text fontSize="xs" fontWeight="bold">
            Repeat days
          </Text>
          <WeekDaysCheckbox
            value={internalState.days}
            onChange={(value) => setInternalState({ ...internalState, days: value })}
          />
          <Button bg="af.teal" color="white" disabled={isDisabled} onClick={handleAddRule}>
            Add this frequeny rule
          </Button>
          {!isEmpty(rrules) && (
            <>
              <Heading size="md" mt="2rem" mb="1rem">
                Frequency rules
              </Heading>
              <Text color="#616167">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              </Text>
              <FrequencyTable rrules={rrules} onDelete={handleDelete} />
            </>
          )}
        </Flex>
      </Flex>
      <Navigation isValid={!isEmpty(rrules)} />
    </>
  )
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface WDCProps {
  value?: string[]
  onChange: (d: string[]) => any
}

const WeekDaysCheckbox = (props: WDCProps) => {
  const { value = [], onChange } = props
  const [allIsChecked, setAllCheched] = useState(false)

  const { setValue, getCheckboxProps } = useCheckboxGroup({
    defaultValue: value,
    onChange,
  })

  const toggleDays = () => {
    if (!allIsChecked) {
      setValue(WEEKDAYS)
      setAllCheched(true)
    } else {
      setValue([])
      setAllCheched(false)
    }
  }

  useEffect(() => {
    if (value.length === 7) {
      setAllCheched(true)
    } else if (value.length !== 0) {
      setAllCheched(false)
    }
  }, [value])

  return (
    <HStack my="1rem" spacing="1rem">
      <CheckboxCard isChecked={allIsChecked} onChange={toggleDays}>
        All
      </CheckboxCard>
      <CheckboxGroup isNative>
        {WEEKDAYS.map((day) => {
          const checkbox = getCheckboxProps({ value: day })
          return (
            <CheckboxCard {...checkbox} key={day}>
              {day}
            </CheckboxCard>
          )
        })}
      </CheckboxGroup>
    </HStack>
  )
}

export const ruleText = (r: string) => {
  const rule = rrulestr(r)
  const time = format(rule.options.dtstart, 'HH:mm')
  const [freq, days] = rule.toText().replace(' for 10 times', '').split(' on ')
  return { freq, days, time }
}

interface FrequencyTableProps {
  rrules: string[]
  onDelete: any
}

const FrequencyTable = (props: FrequencyTableProps) => {
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
            const { freq, days, time } = ruleText(rule)
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
            <Td colspan="4" textAlign="center">
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

const UpcomingDates = ({ onClose, isOpen }: any) => {
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
