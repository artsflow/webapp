import React, { useState } from 'react'
import { Flex, Heading, Text, HStack, Input, VStack, Button } from '@chakra-ui/react'
import Select from 'react-select'
import { useStateMachine } from 'little-state-machine'
import { isEmpty, uniq, difference } from 'lodash'
import { RRule, Weekday, rrulestr } from 'rrule'
import { getDate, getMonth, getYear } from 'date-fns'

import { Navigation } from 'components/Activity/Navigation'
import { update } from 'components/Activity/utils'

import { FrequencyTable } from './FrequencyTable'
import { WeekDaysCheckbox } from './WeekDaysCheckbox'
import { FrequencyRules } from './UpcomingDates'

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
      count: 15,
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
