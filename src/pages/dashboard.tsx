import { Box, Text, Heading, VStack, HStack, Button } from '@chakra-ui/react'
import { uniqBy, sumBy } from 'lodash'
import { DownloadIcon } from '@chakra-ui/icons'

import BalanceSvg from 'svg/icons/balance.svg'
import BookingsSvg from 'svg/icons/bookings.svg'
import AttendeesSvg from 'svg/icons/attendees.svg'
import AudienceSvg from 'svg/icons/audience.svg'

import { activityDownload } from 'lib/utils'
import { Meta, Loading } from 'components'
import { Card, BookingList, Chart, getIncomeLast7d } from 'components/Dashboard'
import { useBalance, useBookings, useActivities, useActivityViews, useAudience } from 'hooks'
import { trackDownloadActivityBooking } from 'analytics'

export default function Dashboard(): JSX.Element {
  const [balance, loadingBalance] = useBalance()
  const { pending } = balance
  const pendingBalance = `£${pending?.[0].amount / 100 || 0}`
  const [bookings = [], loadingBookings] = useBookings()
  const attendees = uniqBy(bookings, 'userId')
  const [activities = [], loadingActivities] = useActivities()
  const [views, loadingViews] = useActivityViews()
  const [audience, loadingAudience] = useAudience()

  const chartData = [{ data: getIncomeLast7d(bookings), key: 'Income', stroke: '#45BCC8' }]
  const viewsData = [{ data: views, key: 'Views', stroke: '#E27CB0' }]

  return (
    <>
      <Meta title="Dashboard" />
      <Box p="40px" w="full">
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
              icon={AttendeesSvg}
              text="Attendees"
              subtext={attendees.length}
            />
            <Card
              loading={loadingAudience}
              icon={AudienceSvg}
              text="Audience"
              subtext={audience.length}
            />
          </HStack>
          <HStack spacing="1.5rem" w="full">
            <Chart data={chartData} loading={loadingBookings} sign="£">
              <Text textAlign="center">
                <b>£{sumBy(chartData[0].data, 'y')}</b> gross income over the last 7 days
              </Text>
            </Chart>
            <Chart data={viewsData} loading={loadingViews}>
              <Text textAlign="center">
                <b>{sumBy(viewsData[0].data, 'y')}</b> activity pages views over the last 7 days
              </Text>
            </Chart>
          </HStack>
          {loadingActivities && <Loading />}
          <VStack spacing="2rem" w="full" maxW="calc(860px + 1.5rem)">
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
                      Download data ({list.length})
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
