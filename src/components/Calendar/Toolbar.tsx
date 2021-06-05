import { Text, HStack, ButtonGroup, Button, IconButton } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

import {
  trackCalendarToday,
  trackCalendarPrev,
  trackCalendarNext,
  trackCalendarView,
} from 'analytics'

export const Toolbar = (props: any) => {
  const {
    localizer: { messages },
    label,
    onNavigate,
    onView,
    views,
    view,
  } = props

  return (
    <HStack mb="2rem" justifyContent="space-between">
      <ButtonGroup variant="outline" spacing="8px" mr="1rem">
        <Button
          variant="ghost"
          colorScheme="ghost"
          shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
          bg="white"
          rounded="12px"
          aria-label="Today"
          fontSize="xs"
          onClick={() => {
            onNavigate('TODAY')
            trackCalendarToday()
          }}
        >
          Today
        </Button>
        <IconButton
          variant="ghost"
          colorScheme="ghost"
          shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
          bg="white"
          rounded="12px"
          aria-label="Prev"
          icon={<ChevronLeftIcon />}
          onClick={() => {
            onNavigate('PREV')
            trackCalendarPrev()
          }}
        />
        <IconButton
          variant="ghost"
          colorScheme="ghost"
          shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
          bg="white"
          rounded="12px"
          aria-label="Next"
          icon={<ChevronRightIcon />}
          onClick={() => {
            onNavigate('NEXT')
            trackCalendarNext()
          }}
        />
      </ButtonGroup>
      <Text fontWeight="bold" fontSize="1rem" mr="auto">
        {label}
      </Text>
      <ButtonGroup>
        {views?.map((v: string) => {
          const isSelected = v === view
          return (
            <Button
              key={v}
              variant="ghost"
              colorScheme="ghost"
              color={isSelected ? 'af.teal' : 'black'}
              shadow={isSelected ? 'none' : '0px 3px 8px rgba(50, 50, 71, 0.05)'}
              bg={isSelected ? '#e0f4f7' : 'white'}
              rounded="12px"
              aria-label="Today"
              fontSize="xs"
              onClick={() => {
                onView(v)
                trackCalendarView(v)
              }}
            >
              {messages[v]}
            </Button>
          )
        })}
      </ButtonGroup>
    </HStack>
  )
}
