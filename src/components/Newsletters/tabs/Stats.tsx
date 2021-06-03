import { Text, VStack, Tooltip, HStack, Icon } from '@chakra-ui/react'
import { format } from 'date-fns'
import pluralize from 'pluralize'

import { useNewsletterStats } from 'hooks'
import { Loading } from 'components'
import { Chart } from 'components/Dashboard/Chart'

export const Stats = () => {
  const [stats, loading] = useNewsletterStats()

  if (loading) return <Loading />

  console.log(stats)

  const totalSent = stats?.sent?.Sent || 0
  const totalOpen = stats?.open?.Unique || 0
  const openPercent = ((totalOpen / totalSent) * 100).toFixed(2)
  const totalUniqueClicks = stats?.clicks?.Unique || 0
  const totalClicks = stats?.clicks?.Clicks || 0
  const totalSpam = stats?.spam?.SpamComplaint || 0
  const totalUnsubscribed = stats?.suppressions?.Suppressions?.length || 0
  const totalBounced = stats?.bounced?.DnsError || 0
  const bouncedPercent = ((totalBounced / totalSent) * 100).toFixed(2)

  const sentData = stats?.sent?.Days?.map(({ Date: d, Sent }: any) => ({
    x: format(new Date(d), 'dd MMM'),
    y: Sent,
  }))

  const openData = stats?.open?.Days?.map(({ Date: d, Unique }: any) => ({
    x: format(new Date(d), 'dd MMM'),
    y: Unique,
  }))

  const clickData = stats?.clicks?.Days?.map(({ Date: d, Unique }: any) => ({
    x: format(new Date(d), 'dd MMM'),
    y: Unique,
  }))

  const data = [
    { data: sentData, key: 'Sent', stroke: '#765EA6' },
    { data: clickData, key: 'Clicked', stroke: '#3182CE' },
    { data: openData, key: 'Open', stroke: '#38A169' },
  ]

  return (
    <VStack maxW="800px" spacing="2rem">
      <Chart data={data} loading={loading} maxW="full" />
      <VStack fontSize="lg">
        <Text>
          You sent{' '}
          <Text as="span" color="af.violet" fontWeight="bold">
            {totalSent}
          </Text>{' '}
          emails in the last 30 days,{' '}
          <Text as="span" color="af.pink" fontWeight="bold">
            {bouncedPercent}%
          </Text>{' '}
          bounced.
        </Text>
        <Text>
          Out of {totalSent} emails with open tracking,{' '}
          <Text as="span" color="green.500" fontWeight="bold">
            {openPercent}%
          </Text>{' '}
          were opened.
        </Text>
        <Text>
          Your links were clicked{' '}
          <Text as="span" color="blue.500" fontWeight="bold">
            {totalClicks}
          </Text>{' '}
          {pluralize('time', totalClicks)} ({totalUniqueClicks}{' '}
          {pluralize('unique', totalUniqueClicks)})
        </Text>
        <Text>
          {' '}
          <Text as="span" color="af.pink" fontWeight="bold">
            {totalUnsubscribed}
          </Text>{' '}
          {pluralize('people', totalUnsubscribed)} unsubscribed
        </Text>
      </VStack>
      <VStack alignItems="flex-start" pl="33%" spacing="0.5rem">
        <HStack>
          <Text color="gray.600">
            <Text as="span" color="blue.500" fontWeight="bold" fontSize="lg" pr="0.7rem">
              {totalSpam}
            </Text>
            spam {pluralize('complaint', totalSpam)}
          </Text>
          <Tooltip
            hasArrow
            label="To avoid delivery issues to ISPs, spam rates should stay below 0.1% (1 complaint for every 1,000 emails sent)."
            bg="black"
            color="white"
            placement="right"
          >
            <Icon color="gray.500" cursor="help" boxSize="0.85rem" />
          </Tooltip>
        </HStack>
        <Text color="#888" fontSize="xs" pl="1.5rem">
          Your spam rate is looking good. Keep up the good work!
        </Text>
      </VStack>
    </VStack>
  )
}
