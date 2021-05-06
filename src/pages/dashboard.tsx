import { Box, Heading, VStack, HStack } from '@chakra-ui/react'
import { uniqBy } from 'lodash'

import BalanceSvg from 'svg/icons/balance.svg'
import BookingsSvg from 'svg/icons/bookings.svg'
import AudienceSvg from 'svg/icons/audience.svg'

import { Meta, Loading } from 'components'
import { Card, BookingList } from 'components/Dashboard'
import { useBalance, useBookings, useActivities } from 'hooks'

export default function Dashboard(): JSX.Element {
  const [balance = {}, loadingBalance] = useBalance()
  const { pending } = balance
  const pendingBalance = `£${pending?.[0].amount / 100 || 0}`
  const [bookings = [], loadingBookings] = useBookings()
  const audience = uniqBy(bookings, 'userId')
  const [activities = [], loadingActivities] = useActivities()

  console.log(bookings, activities)

  return (
    <>
      <Meta title="Dashboard" />
      <Box p="40px">
        <Heading fontSize="lg" mb="1rem">
          Dashboard
        </Heading>
        <VStack alignItems="flex-start" spacing="1.5rem">
          <HStack spacing="1.5rem">
            <Card
              loading={loadingBalance}
              icon={BalanceSvg}
              text="Pending balance"
              subtext={pendingBalance}
            />
            <Card
              loading={loadingBookings}
              icon={BookingsSvg}
              text="Bookings"
              subtext={bookings?.length}
            />
            <Card
              loading={loadingBookings}
              icon={AudienceSvg}
              text="Audience"
              subtext={audience.length}
            />
          </HStack>
          {loadingActivities && <Loading />}
          {activities.map(({ id, title }: any) => (
            <>
              <Heading size="sm" key={id}>
                {title}
              </Heading>
              <BookingList list={bookings.filter(({ activityId }: any) => activityId === id)} />
            </>
          ))}
        </VStack>
      </Box>
    </>
  )
}
