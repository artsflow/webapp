import { useEffect } from 'react'
import { VStack, HStack, Text, Button, Heading, Input, Icon } from '@chakra-ui/react'
import { useStateMachine } from 'little-state-machine'
import { setHours, setMinutes } from 'date-fns'
import DatePicker, { registerLocale } from 'react-datepicker'
import gb from 'date-fns/locale/en-GB'

import 'react-datepicker/dist/react-datepicker.css'

import TrashcanIcon from 'svg/icons/trashcan.svg'
import { update } from '../utils'
import { Navigation } from '../Navigation'

registerLocale('en-GB', gb)

export function Dates() {
  const { state, actions } = useStateMachine({ update }) as any

  const handleChange = (date: Date, index: number) => {
    const newDates = [...dates]
    newDates[index] = date.toString()
    actions.update({ dates: newDates })
  }

  const handleAddMore = () => {
    actions.update({ dates: [...state.dates, new Date().toString()] })
  }

  const handleDelete = (index: number) => {
    actions.update({ dates: dates.filter((d: string, i: number) => i !== index) })
  }

  const isValid = state.dates.length > 0

  const dates = isValid ? state.dates : [new Date().toString()]

  useEffect(() => {
    actions.update({ dates })
  }, [])

  return (
    <>
      <VStack justifyContent="space-between" alignItems="flex-start" p="40px" spacing="0">
        <Heading size="md">Select time and date</Heading>
        <Text pt="1rem" color="#616167">
          Please choose the dates and times of your activity.
        </Text>
        <VStack pt="2rem" alignItems="flex-start" spacing="1rem">
          <HStack>
            <Text fontWeight="semibold" w="140px">
              Start date
            </Text>
            <Text fontWeight="semibold">Start time</Text>
          </HStack>
          {dates.map((date: Date, index: number) => (
            <HStack key={date.toString()} spacing="0">
              <DatePicker
                locale="en-GB"
                selected={new Date(date)}
                minDate={new Date()}
                onChange={(d: Date) => handleChange(d, index)}
                customInput={<CustomInput mr="1rem" />}
                dateFormat="dd MMM, yyyy"
              />

              <DatePicker
                locale="en-GB"
                selected={new Date(date)}
                onChange={(d: Date) => handleChange(d, index)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                minTime={setHours(setMinutes(new Date(), 0), 7)}
                maxTime={setHours(setMinutes(new Date(), 30), 22)}
                customInput={<CustomInput w="100px" />}
              />
              {index > 0 && (
                <Button
                  leftIcon={<Icon w="16px" h="16px" as={TrashcanIcon} />}
                  variant="ghost"
                  fontSize="xs"
                  color="af.pink"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </Button>
              )}
            </HStack>
          ))}
          <Button bg="#edf8fa" color="af.teal" onClick={handleAddMore}>
            Add more
          </Button>
        </VStack>
      </VStack>
      <Navigation isValid={isValid} />
    </>
  )
}

const CustomInput = (props: any) => (
  <Input
    bg="white"
    border="1px solid white"
    shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
    rounded="6px"
    w="130px"
    {...props}
  />
)
