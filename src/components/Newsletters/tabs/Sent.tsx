import { useState } from 'react'
import {
  Text,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react'
import { format, fromUnixTime } from 'date-fns'
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser'

import { useSentNewsletters, useNewsletterEvents } from 'hooks'
import { Loading } from 'components'

export const Sent = () => {
  const [selected, setSelected] = useState(-1)
  const [list, loading] = useSentNewsletters()

  if (loading) return <Loading />

  if (!list.length) return <Box>You haven't sent any newsletters yet</Box>

  return (
    <Accordion maxW="800px" onChange={(id: number) => setSelected(id)}>
      {list?.map(({ id, subject, createdAt, recipients, body }: any, index: number) => (
        <MessageHeader
          key={id}
          subject={subject}
          date={createdAt.seconds}
          recipients={recipients}
          messageId={id}
          isOpen={index === selected}
          body={body}
        />
      ))}
    </Accordion>
  )
}

const MessageHeader = ({ subject, date, recipients, messageId, isOpen, body }: any) => (
  <AccordionItem bg="white" borderWidth={isOpen ? '2px' : 0} borderColor="af.teal">
    <AccordionButton _focus={{ outlineWidth: 0 }}>
      <Box flex="1" textAlign="left" fontWeight={isOpen ? 'bold' : 'normal'}>
        {subject}
      </Box>
      <VStack alignItems="flex-end" mr="1rem" spacing="0">
        <Text fontSize="xs" color="gray.500">
          {recipients} recipients
        </Text>
        <Text fontSize="xs" color="gray.800">
          {format(fromUnixTime(date), 'dd MMM, yyy @ HH:mm')}
        </Text>
      </VStack>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel pb={4}>
      <MessageDetail id={messageId} body={body} isOpen={isOpen} />
    </AccordionPanel>
  </AccordionItem>
)

const MessageDetail = ({ id, body, isOpen }: any) => (
  <HStack spacing="1rem" alignItems="flex-start" h="360px" w="full">
    <Box
      bg="#FAFAFA"
      w="640px"
      maxW="640px"
      h="full"
      px="2rem"
      py="1rem"
      overflow="scroll"
      children={ReactHtmlParser(body, { transform: removeLinks })}
    />
    {isOpen && <MessageEvents id={id} />}
  </HStack>
)

const MessageEvents = ({ id }: any) => {
  const [events, loading] = useNewsletterEvents(id)

  return (
    <VStack overflow="scroll" alignItems="center" h="full" w="260px">
      <Text fontWeight="semibold" w="full">
        Message events:
      </Text>
      {loading && <Loading />}
      {events
        ?.flat()
        .map(
          (
            {
              recipient,
              timestamp,
              record_type: recordType,
              suppress_sending: suppress,
              suppression_reason: reason,
            }: any,
            key: number
          ) => (
            <HStack key={key} justifyContent="space-between" alignItems="flex-end" w="full">
              <Box fontSize="xs">
                <Text color="gray.500">
                  {format(new Date(timestamp?.value), 'dd MMM, yyy @ HH:mm')}
                </Text>
                <Text>{recipient}</Text>
              </Box>
              <EventStatus type={recordType} suppress={suppress} reason={reason} />
            </HStack>
          )
        )}
    </VStack>
  )
}

const EventStatus = ({ type, suppress, reason }: any) => {
  const typeMap = {
    Delivery: 'delivered',
    Open: 'open',
    Click: 'link clicked',
    SubscriptionChange: getSubscriptionChange(suppress, reason),
  } as any

  return (
    <Badge variant={typeMap[type]} size="xs">
      {typeMap[type]}
    </Badge>
  )
}

const removeLinks = (node: any, index: number) => {
  if (node.type === 'tag' && node.name === 'a') {
    const newNode = { ...node, attribs: { ...node.attribs, href: '#' } }
    return convertNodeToElement(newNode, index, removeLinks)
  }
  return convertNodeToElement(node, index, removeLinks)
}

const getSubscriptionChange = (suppress: boolean, reason: string | null) => {
  if (suppress && reason === 'ManualSuppression') return 'unsubscribed'
  if (!suppress && !reason) return 're-subscribed'
  if (suppress && reason === 'HardBounce') return 'bounced'
  return null
}
