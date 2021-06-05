import { useState, useEffect } from 'react'
import { chakra, Text, VStack, Input, Button, HStack, Link } from '@chakra-ui/react'
import { useForm, Controller } from 'react-hook-form'
import { WarningTwoIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'
import Select from 'react-select'
import { useTimer } from 'react-timer-hook'
import { addSeconds } from 'date-fns'
import { uniqBy } from 'lodash'
import { useRouter } from 'next/router'

import { useActivities, useBookings, useAudience, useUserData } from 'hooks'
import { trackNewsletterSent } from 'analytics'
import { sendNewsletter } from 'api'
import { showAlert } from 'lib/utils'
import { Editor } from '../Editor'
import { selectStyles } from '../utils'

const options = [
  { value: 'myself', label: 'Myself (just testing)' },
  { value: 'everybody', label: 'Everybody' },
  { value: 'audience', label: 'Imported audience' },
  { value: 'bookings', label: 'All activities bookings' },
]

const CSelect = chakra(Select)

export const Compose = () => {
  const [list, setList] = useState(options)
  const [loading, setLoading] = useState(false)
  const [totalSelected, setTotalSelected] = useState(1)
  const { handleSubmit, register, control, getValues, watch } = useForm({ mode: 'onBlur' })
  const [activities] = useActivities()
  const [bookings] = useBookings()
  const [audience] = useAudience()
  const { user } = useUserData()
  const router = useRouter()

  const watchTo = watch(['to'])

  useEffect(() => {
    const totalAudience = audience.length
    const totalBookings = uniqBy(bookings, 'userId')?.length || 0

    const toValue = watchTo?.[0]?.value

    switch (toValue) {
      case 'myself':
        setTotalSelected(1)
        break
      case 'everybody':
        setTotalSelected(uniqBy([...bookings, ...audience], 'email').length)
        break
      case 'audience':
        setTotalSelected(totalAudience)
        break
      case 'bookings':
        setTotalSelected(totalBookings)
        break
      default:
        setTotalSelected(
          uniqBy(
            bookings?.filter((b: any) => b.activityId === toValue),
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
    const formData = getValues()
    setLoading(true)
    const res = await sendNewsletter(formData)

    if (formData.to.value === 'myself') {
      if (res?.data?.ok) {
        showAlert({
          title: `Test email sent to ${user.email}`,
          status: 'success',
        })
        trackNewsletterSent({
          to: formData.to.value,
          recipients: totalSelected,
          subject: formData.subject,
          newsletterId: res?.data?.newsletterId,
        })
      } else {
        showAlert({
          title: 'Error!',
          description: res.data,
          status: 'error',
        })
      }
    } else if (res?.data?.ok) {
      showAlert({
        title: `Newsletter sent`,
        status: 'success',
      })

      trackNewsletterSent({
        to: formData.to.value,
        recipients: totalSelected,
        subject: formData.subject,
        newsletterId: res?.data?.newsletterId,
      })
      localStorage.removeItem('af-editor-value')
      const url = `/newsletters/sent`
      router.push(url)
    } else {
      showAlert({
        title: 'Error! Please try again!',
        description: res.data,
        status: 'error',
      })
    }
    setLoading(false)
  }

  const { seconds, isRunning, pause, restart } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: handleSendMessage,
  })

  const onSubmit = async () => {
    const formData = getValues()
    if (formData.body === '<p></p>') {
      showAlert({
        title: "Body can't be empty!",
        status: 'warning',
      })
    } else if (isRunning) {
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
            name="to"
            control={control}
            defaultValue={options[0]}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <CSelect
                w="360px"
                {...field}
                options={list}
                isSearchable={false}
                styles={selectStyles}
              />
            )}
          />
        </VStack>

        <VStack alignItems="flex-start" spacing="0.5rem">
          <Text fontSize="sm" fontWeight="semibold">
            Subject
          </Text>
          <Input
            w="640px"
            placeholder="Enter subject..."
            {...register('subject', {
              required: true,
              maxLength: 100,
            })}
          />
        </VStack>

        <Controller
          name="body"
          control={control}
          render={({ field }) => <Editor {...field} activities={activities} />}
        />

        {!user.isVerified && (
          <NextLink href="/" passHref>
            <Link>
              <HStack>
                <WarningTwoIcon color="af.pink" />
                <Text fontSize="12px" color="af.pink" fontWeight="bold">
                  Only verified accounts can send newsletters - Click here to verfy!
                </Text>
              </HStack>
            </Link>
          </NextLink>
        )}

        <HStack>
          <Button
            bg={isRunning ? 'af.pink' : 'af.teal'}
            color="white"
            type="submit"
            _focus={{ outline: 'none' }}
            disabled={!totalSelected || !user.isVerified}
            isLoading={loading}
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
