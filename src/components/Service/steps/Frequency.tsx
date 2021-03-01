import { useState, useContext, useEffect } from 'react'
import {
  Box,
  Text,
  Heading,
  CheckboxGroup,
  Checkbox,
  HStack,
  VStack,
  Input,
  Button,
  Select,
  IconButton,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { isEmpty, uniq, pick, difference } from 'lodash'
import { RRule, RRuleSet, Weekday, rrulestr } from 'rrule'
import { getDate, getMonth, getYear, format } from 'date-fns'

import { Context, Meta } from '../machine'

const weekDaysMap: Record<string, Weekday> = {
  Mo: RRule.MO,
  Tu: RRule.TU,
  We: RRule.WE,
  Th: RRule.TH,
  Fr: RRule.FR,
  Sa: RRule.SA,
  Su: RRule.SU,
}
interface State {
  days: string[]
  time: string
  interval: number
  rrules: string[]
  exdate: string[]
  meta: Meta
}

export function Frequency() {
  const { send, context } = useContext(Context) as any
  const { frequency, meta } = context

  const initialState: State = {
    days: [],
    time: '',
    interval: 1,
    rrules: frequency.rrules,
    exdate: frequency.exdate,
    meta,
  }
  const [state, setState] = useState(initialState)
  const isDisabled = isEmpty(state.days) || !state.time.length

  const rruleSet = new RRuleSet()
  state.rrules.forEach((r) => rruleSet.rrule(rrulestr(r)))

  const handleClick = () => {
    const now = new Date()
    const day = getDate(now)
    const month = getMonth(now)
    const year = getYear(now)
    const [hh, mm] = state.time.split(':')
    const dstart = new Date(Date.UTC(year, month, day, +hh, +mm, 0))

    const rule = new RRule({
      freq: RRule.WEEKLY,
      interval: state.interval,
      byweekday: state.days.map((d) => weekDaysMap[d]),
      dtstart: dstart,
      count: 10,
    })

    setState({
      ...state,
      rrules: uniq([...state.rrules, rule.toString()]),
      meta: { isDirty: true },
    })
  }

  const toggleExDate = (d: string) => {
    const isExcluded = state.exdate.includes(d)
    if (!isExcluded) setState({ ...state, exdate: [...state.exdate, d], meta: { isDirty: true } })
    else
      setState({ ...state, exdate: state.exdate.filter((e) => e !== d), meta: { isDirty: true } })
  }

  const handleDelete = (r: string) => {
    setState({
      ...state,
      rrules: state.rrules.filter((e) => e !== r),
      exdate: difference(
        state.exdate,
        rrulestr(r)
          .all()
          .map((e) => e.toString())
      ),
    })
  }

  useEffect(() => {
    send({
      type: 'UPDATE',
      data: { frequency: pick(state, ['rrules', 'exdate']), meta: state.meta },
    })
  }, [state.rrules, state.exdate])

  return (
    <Box w="full">
      <Heading mb="4" size="lg">
        Frequency
      </Heading>
      <HStack justify="space-between" align="flex-start">
        <VStack spacing="4" align="flex-start">
          <HStack>
            <Text>Every</Text>
            <Select w="16" onChange={(e) => setState({ ...state, interval: +e.target.value })}>
              {[1, 2, 3, 4].map((v) => (
                <option selected={v === state.interval} key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>
            <Text>week{state.interval > 1 ? 's' : ''}</Text>
            <Text>at</Text>
            <Input
              type="time"
              w="28"
              value={state.time}
              onChange={(e) => setState({ ...state, time: e.target.value })}
            />
          </HStack>
          <HStack align="flex-end">
            <Text>on</Text>
            <WeekDaysCheckbox
              value={state.days}
              onChange={(days) => setState({ ...state, days })}
            />
            <Button disabled={isDisabled} onClick={handleClick}>
              Add
            </Button>
          </HStack>

          {!isEmpty(state.rrules) && <Text fontWeight="bold">Rules:</Text>}
          <VStack align="flex-start" height="220px" overflow="scroll" w="full">
            {state.rrules.map((r) => (
              <HStack key={r} w="full" justify="space-between">
                <Text fontSize="xs">{ruleText(r)}</Text>
                <IconButton
                  aria-label="Delete rule"
                  icon={<DeleteIcon />}
                  color="red.500"
                  onClick={() => handleDelete(r)}
                />
              </HStack>
            ))}
          </VStack>
        </VStack>

        <VStack align="flex-start" height="400px" overflow="scroll" w="full" spacing="0">
          {!isEmpty(rruleSet.all()) && <Text fontWeight="bold">Booking dates:</Text>}
          {rruleSet.all().map((d) => (
            <Button
              p="1"
              fontSize="xs"
              key={d.toString()}
              variant="ghost"
              onClick={() => toggleExDate(d.toString())}
            >
              <Text
                textDecor={state.exdate.includes(d.toString()) ? 'line-through' : ''}
                fontWeight={state.exdate.includes(d.toString()) ? 'bold' : 'normal'}
              >
                {format(d, 'HH:mm EEEE dd MMMM yyyy')}
              </Text>
            </Button>
          ))}
        </VStack>
      </HStack>
    </Box>
  )
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

interface WDCProps {
  value?: string[]
  onChange: (d: string[]) => any
}
const WeekDaysCheckbox = (props: WDCProps) => {
  const { value = [], onChange } = props
  return (
    <CheckboxGroup isNative colorScheme="green" defaultValue={value} onChange={onChange}>
      <HStack>
        {WEEKDAYS.map((day) => (
          <VStack key={day}>
            <Text>{day}</Text>
            <Checkbox value={day} icon={<AddIcon />} iconSize="1rem" />
          </VStack>
        ))}
      </HStack>
    </CheckboxGroup>
  )
}

export const ruleText = (r: string) => {
  const rule = rrulestr(r)
  const hhmm = format(rule.options.dtstart, 'HH:mm')
  return `at ${hhmm} on ${rule.toText()}`.replace(' for 10 times', '')
}
