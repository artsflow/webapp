import { Box, Text, Heading, VStack, HStack, Button } from '@chakra-ui/react'
import { uniqBy, sumBy } from 'lodash'
import { DownloadIcon } from '@chakra-ui/icons'

import BalanceSvg from 'svg/icons/balance.svg'
import BookingsSvg from 'svg/icons/bookings.svg'
import AudienceSvg from 'svg/icons/audience.svg'

import { activityDownload } from 'lib/utils'
import { Meta, Loading } from 'components'
import { Card, BookingList, Chart, getIncomeLast7d } from 'components/Dashboard'
import { useBalance, useBookings, useActivities } from 'hooks'
import { trackDownloadActivityBooking } from 'analytics'

export default function Dashboard(): JSX.Element {
  const [balance, loadingBalance] = useBalance()
  const { pending } = balance
  const pendingBalance = `£${pending?.[0].amount / 100 || 0}`
  const [bookings = [], loadingBookings] = useBookings()
  const audience = uniqBy(bookings, 'userId')
  const [activities = [], loadingActivities] = useActivities()

  const chartData = getIncomeLast7d(bookings)

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
          <Chart data={chartData}>
            <Text textAlign="center">
              Gross income for the last 7 days: <b>£{sumBy(chartData, 'y')}</b>
            </Text>
          </Chart>
          {loadingActivities && <Loading />}
          <VStack spacing="2rem">
            {activities.map(({ id, title }: any) => {
              const list = bookings.filter(({ activityId }: any) => activityId === id)
              return (
                <VStack key={id} w="full">
                  <HStack justifyContent="space-between" w="full">
                    <Heading size="sm">{title}</Heading>
                    <Button
                      disabled={!list.length}
                      leftIcon={<DownloadIcon />}
                      size="xs"
                      bg="af.teal"
                      color="white"
                      onClick={() => {
                        activityDownload(list)
                        trackDownloadActivityBooking(id, title)
                      }}
                    >
                      Download data
                    </Button>
                  </HStack>
                  <BookingList list={list} />
                </VStack>
              )
            })}
          </VStack>
        </VStack>
      </Box>
    </>
  )
}
