import { useState, useEffect } from 'react'
import { chakra, Text, VStack, Input, Button, HStack } from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import { useTimer } from 'react-timer-hook'
import { addSeconds } from 'date-fns'
import { uniqBy } from 'lodash'

import { useActivities, useBookings, useAudience } from 'hooks'
import { sendNewsletter } from 'api'
import { Editor } from '../Editor'
import { selectStyles } from '../utils'

const options = [
  { value: 'myself', label: 'Myself (just testing)' },
  { value: 'everybody', label: 'Everybody' },
  { value: 'imported', label: 'Imported audience' },
  { value: 'activities', label: 'All activities members' },
]

const CSelect = chakra(Select)

export const Compose = () => {
  const [list, setList] = useState(options)
  const [totalSelected, setTotalSelected] = useState(1)
  const { register, handleSubmit, control, getValues, watch } = useForm({ mode: 'onBlur' })
  const [activities] = useActivities()
  const [bookings] = useBookings()
  const [audience] = useAudience()

  const watchTo = watch(['to'])

  useEffect(() => {
    const totalImported = audience.length
    const totalBookings = uniqBy(bookings, 'userId')?.length || 0

    switch (watchTo.to?.value) {
      case 'myself':
        setTotalSelected(1)
        break
      case 'everybody':
        setTotalSelected(totalBookings + totalImported)
        break
      case 'imported':
        setTotalSelected(totalImported)
        break
      case 'activities':
        setTotalSelected(totalBookings)
        break
      default:
        setTotalSelected(
          uniqBy(
            bookings?.filter((b: any) => b.activityId === watchTo.to?.value),
            'userId'
          )?.length || 0
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

  const handleSendMessage = async () => {
    const res = await sendNewsletter(getValues())
    console.info('call backend', res)
  }

  const { seconds, isRunning, pause, restart } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: handleSendMessage,
  })

  const onSubmit = async () => {
    if (isRunning) {
      pause()
    } else {
      restart(addSeconds(new Date(), 1))
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

        <Controller as={Editor} name="body" control={control} activities={activities} />
        <HStack>
          <Button
            bg={isRunning ? 'af.pink' : 'af.teal'}
            color="white"
            type="submit"
            _focus={{ outline: 'none' }}
            disabled={!totalSelected}
            w="80px"
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
