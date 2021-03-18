import React from 'react'
import { Text, Heading, Box } from '@chakra-ui/react'
import { Calendar } from 'components'

export default function CalendarPage(): JSX.Element {
  const myEventsList: any = []

  return (
    <Box p="40px" w="full">
      <Heading fontSize="1.5rem" mb="1rem">
        Calendar
      </Heading>
      <Text mb="2rem">
        All of your activities are here on your calendar. Switch between Day, Week or Month view.
      </Text>
      <Calendar events={myEventsList} />
    </Box>
  )
}
