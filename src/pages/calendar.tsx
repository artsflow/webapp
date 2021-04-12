import React from 'react'
import { Text, Heading, Box } from '@chakra-ui/react'
import { RRuleSet, rrulestr } from 'rrule'
import { addMinutes } from 'date-fns'
import { flatten } from 'lodash'

import { useActivities } from 'hooks'
import { Calendar, Meta } from 'components'

const makeEvents = (activities: any) =>
  flatten(
    activities?.map(({ id, title, duration, frequency }: any) => {
      const { rrules } = frequency
      const rruleSet = new RRuleSet()
      rrules.forEach((r: string) => rruleSet.rrule(rrulestr(r)))

      return rruleSet
        .all()
        .map((d) => ({ id, title, start: new Date(d), end: addMinutes(d, duration) }))
    })
  )

export default function CalendarPage(): JSX.Element {
  const [activities] = useActivities()
  const events = makeEvents(activities) || []

  return (
    <>
      <Meta title="Calendar" />
      <Box p="40px" w="full" h="auto">
        <Heading fontSize="1.5rem" mb="1rem">
          Calendar
        </Heading>
        <Text mb="2rem">
          All of your activities are here on your calendar. Switch between Day, Week or Month view.
        </Text>
        <Calendar events={events} />
      </Box>
    </>
  )
}
