import React from 'react'
import { Text, Heading, Box } from '@chakra-ui/react'
import { addMinutes } from 'date-fns'
import { flatten } from 'lodash'

import { useActivities } from 'hooks'
import { Calendar, Meta } from 'components'

const makeEvents = (activities: any) =>
  flatten(
    activities?.map(({ id, title, duration, dates }: any) =>
      dates?.map((d: string) => ({
        id,
        title,
        start: new Date(d),
        end: addMinutes(new Date(d), duration),
      }))
    )
  )

export default function CalendarPage(): JSX.Element {
  const [activities] = useActivities()
  const events = makeEvents(activities) || []

  return (
    <>
      <Meta title="Calendar" />
      <Box p="40px" w="full" h="auto">
        <Heading fontSize="lg" mb="1rem">
          Calendar
        </Heading>
        <Text mb="2rem">
          All of your activities are here on your calendar. Switch between Week, Month or Agenda
          view.
        </Text>
        <Calendar events={events} />
      </Box>
    </>
  )
}
