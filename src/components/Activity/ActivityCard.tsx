import {
  Image,
  Tag,
  Flex,
  Text,
  Heading,
  HStack,
  VStack,
  Icon,
  Tooltip,
  Link,
  Skeleton,
} from '@chakra-ui/react'
import { RRuleSet, rrulestr } from 'rrule'
import { format, addMinutes } from 'date-fns'
import { IoRepeat } from 'react-icons/io5'
import { BsLink } from 'react-icons/bs'
import { capitalize } from 'lodash'

import { getImageKitUrl } from 'lib/utils'
import { ruleText } from 'components/Activity/utils'
import { artsflowUrl } from 'lib/config'

export const ActivityCard = (props: any) => {
  const { title, category, images, duration, frequency, type, price, id, loading } = props

  if (loading) return <Skeleton width="360px" height="200px" />

  const { rrules } = frequency
  const rruleSet = new RRuleSet()
  rrules.forEach((r: string) => rruleSet.rrule(rrulestr(r)))
  const [nextSession] = rruleSet.all()

  const from = format(nextSession, 'HH:mm')
  const to = format(addMinutes(nextSession, duration), 'HH:mm')

  const isPaid = type === 'Paid'

  const freqList = rrules.map((rule: string) => {
    const { freq, days, time } = ruleText(rule, duration)
    return `${capitalize(freq)} / ${days} / ${time}`
  })

  const freqLabel = freqList.join('\n')

  return (
    <VStack
      rounded="12px"
      bg="white"
      w="360px"
      minH="200px"
      p="1.5rem"
      spacing="1.5rem"
      shadow="0px 3px 8px -1px rgba(50, 50, 71, 0.05)"
    >
      <HStack spacing="1rem" w="full">
        <Image
          width="48px"
          height="48px"
          rounded="12px"
          src={getImageKitUrl(images[0], { w: 48, h: 48 })}
          bg="af.pink"
        />
        <Heading as="h2" fontSize="1rem" fontWeight="semibold">
          {title}
        </Heading>
      </HStack>
      <HStack justifyContent="flex-start" w="full" spacing="1.5rem">
        <VStack alignItems="flex-start">
          <Text fontSize="xs" color="#616167">
            Next session
          </Text>
          <Text fontSize="xs" fontWeight="bold">
            {format(nextSession, 'MMM dd, yyyy')}
          </Text>
        </VStack>
        <Flex w="1px" bg="#F3F3F3" h="70%" />
        <VStack alignItems="flex-start">
          <Text fontSize="xs" color="#010102">
            Time interval
          </Text>
          <Text fontSize="xs" fontWeight="bold">
            {from} - {to}
          </Text>
        </VStack>
      </HStack>
      <HStack justifyContent="space-between" w="full" alignItems="flex-end">
        <HStack spacing="1rem" alignItems="flex-end">
          <Text fontSize="xs" color="#616167" pb="2px">
            {category}
          </Text>
          <Separator />
          <Text fontSize="xs" color="#616167" pb="2px">
            {isPaid ? `£${price}` : type}
          </Text>
          <Separator />
          <Tooltip label={freqLabel} placement="top" closeOnClick hasArrow shouldWrapChildren>
            <Icon as={IoRepeat} color="#616167" />
          </Tooltip>
          <Separator />
          <Link href={`${artsflowUrl}/a/${id}`} isExternal>
            <Icon as={BsLink} h="16px" w="16px" />
          </Link>
        </HStack>
        <Tag color="af.teal" fontSize="xs" bg="#edf8fa" px="10px" py="8px" rounded="100px">
          Active
        </Tag>
      </HStack>
    </VStack>
  )
}

const Separator = () => <Flex w="1px" bg="#F3F3F3" h="10px" mb="4px" />
