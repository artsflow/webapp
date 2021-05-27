import { useState, useEffect } from 'react'
import { chakra, Text, VStack, Input, Button, HStack } from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { useTimer } from 'react-timer-hook'
import { addSeconds } from 'date-fns'
import { uniqBy } from 'lodash'

import { Editor } from 'components'
import { useActivities, useBookings } from 'hooks'

const options = [
  { value: 'myself', label: 'Myself (just testing)' },
  { value: 'everybody', label: 'Everybody' },
  { value: 'imported', label: 'Imported audience' },
  { value: 'activities', label: 'All activities members' },
]

const totalImported = 0

const CSelect = chakra(Select)

export const Compose = () => {
  const [list, setList] = useState(options)
  const [totalSelected, setTotalSelected] = useState(1)
  const { register, handleSubmit, control, getValues, watch } = useForm({ mode: 'onBlur' })
  const [activities] = useActivities()
  const [bookings] = useBookings()

  const watchTo = watch(['to'])

  useEffect(() => {
    switch (watchTo.to?.value) {
      case 'myself':
        setTotalSelected(1)
        break
      case 'everybody':
        setTotalSelected(bookings.length + totalImported)
        break
      case 'imported':
        setTotalSelected(totalImported)
        break
      case 'activities':
        setTotalSelected(bookings.length)
        break
      default:
        setTotalSelected(
          bookings?.filter((b: any) => b.activityId === watchTo.to?.value).length || 0
        )
    }
  }, [watchTo])

  useEffect(() => {
    if (activities) {
      setList(
        uniqBy(
          [
            ...list,
            ...activities.map(({ id, title }: any) => ({
              value: id,
              label: `Members of "${title}"`,
            })),
          ],
          'value'
        )
      )
    }
  }, [activities, bookings])

  const handleSendMessage = () => {
    console.info('call backend')
    console.log(getValues())
  }

  const { seconds, isRunning, pause, restart } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: handleSendMessage,
  })

  const onSubmit = async () => {
    if (isRunning) {
      pause()
    } else {
      restart(addSeconds(new Date(), 3))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack alignItems="flex-start" spacing="1.5rem" pt="1.5rem">
        <VStack alignItems="flex-start" spacing="0.5rem" w="full">
          <Text fontSize="sm" fontWeight="semibold">
            To
          </Text>
          <Controller
            as={CSelect}
            isSearchable={false}
            w="360px"
            name="to"
            options={list}
            control={control}
            defaultValue={options[0]}
            ref={register({
              required: true,
            })}
            styles={selectStyles}
          />
        </VStack>

        <VStack alignItems="flex-start" spacing="0.5rem">
          <Text fontSize="sm" fontWeight="semibold">
            Subject
          </Text>
          <Input
            bg="white"
            border="1px solid white"
            shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
            rounded="6px"
            w="640px"
            placeholder="Enter subject..."
            ref={register({
              required: true,
              maxLength: 100,
            })}
            name="subject"
            _focusWithin={{ boxShadow: '0 0 0 1px #45BCC8', border: 'none' }}
          />
        </VStack>

        <Controller as={Editor} name="body" control={control} />
        <HStack>
          <Button
            bg={isRunning ? 'af.pink' : 'af.teal'}
            color="white"
            type="submit"
            _focus={{ outline: 'none' }}
            disabled={!totalSelected}
          >
            {isRunning ? 'Cancel' : 'Send'}
          </Button>
          {isRunning && <Text>Sending in {seconds} seconds...</Text>}
          {!isRunning && <Text>{totalSelected} selected</Text>}
        </HStack>
      </VStack>
    </form>
  )
}

const selectStyles = {
  control: (base: any, { isFocused }: any) => ({
    ...base,
    border: '0px',
    padding: '2px',
    paddingLeft: '8px',
    boxShadow: isFocused ? '0px 0px 0px 1px #47BCC8' : '0px 3px 8px rgba(50, 50, 71, 0.05)',
  }),
  menu: (base: any) => ({
    ...base,
    boxShadow: '0px 3px 8px rgba(50, 50, 71, 0.05)',
  }),
  option: (styles: any, { isFocused }: any) => ({
    ...styles,
    backgroundColor: isFocused ? '#47BCC8' : null,
    color: isFocused ? 'white' : 'black',
  }),
}
