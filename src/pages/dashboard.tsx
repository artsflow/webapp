import { Box, Heading, VStack, HStack, Button } from '@chakra-ui/react'
import { uniqBy } from 'lodash'
import { DownloadIcon } from '@chakra-ui/icons'

import BalanceSvg from 'svg/icons/balance.svg'
import BookingsSvg from 'svg/icons/bookings.svg'
import AudienceSvg from 'svg/icons/audience.svg'

import { activityDownload } from 'lib/utils'
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
          <VStack spacing="1rem">
            {activities.map(({ id, title }: any) => {
              const list = bookings.filter(({ activityId }: any) => activityId === id)
              return (
                <>
                  <HStack key={id} justifyContent="space-between" w="full">
                    <Heading size="sm">{title}</Heading>
                    <Button
                      disabled={!list.length}
                      leftIcon={<DownloadIcon />}
                      size="xs"
                      bg="af.teal"
                      color="white"
                      onClick={() => activityDownload(list)}
                    >
                      Download data
                    </Button>
                  </HStack>
                  <BookingList list={list} />
                </>
              )
            })}
          </VStack>
        </VStack>
      </Box>
    </>
  )
}
