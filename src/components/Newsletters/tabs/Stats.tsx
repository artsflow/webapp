import { Text } from '@chakra-ui/react'

import { useNewsletterStats } from 'hooks'

export const Stats = () => {
  const stats = useNewsletterStats()
  console.log(stats)
  return <Text>Stats content</Text>
}
