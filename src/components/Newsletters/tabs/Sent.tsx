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
import { format } from 'date-fns'

import { useSentMessages, useSentMessage } from 'hooks'
import { Loading } from 'components'

export const Sent = () => {
  const [selected, setSelected] = useState(-1)
  const [list, loading] = useSentMessages()

  if (loading) return <Loading />

  return (
    <Accordion maxW="800px" onChange={(id: number) => setSelected(id)}>
      {list?.Messages?.map(({ MessageID, Subject, ReceivedAt, To }: any, index: number) => (
        <MessageHeader
          key={MessageID}
          subject={Subject}
          date={ReceivedAt}
          recipients={To.length}
          messageId={MessageID}
          isOpen={index === selected}
        />
      ))}
    </Accordion>
  )
}

const MessageHeader = ({ subject, date, recipients, messageId, isOpen }: any) => (
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
          {format(new Date(date), 'dd MMM, yyy @ HH:mm')}
        </Text>
      </VStack>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel pb={4}>{isOpen && <MessageDetail id={messageId} />}</AccordionPanel>
  </AccordionItem>
)

const MessageDetail = ({ id }: { id: string }) => {
  const [msg, loading] = useSentMessage(id)

  if (loading) return <Loading />
  const { HtmlBody, MessageEvents } = msg

  return (
    <HStack spacing="1rem" alignItems="flex-start" h="360px">
      <Box
        bg="#FAFAFA"
        w="640px"
        h="full"
        px="2rem"
        py="1rem"
        overflow="scroll"
        dangerouslySetInnerHTML={{ __html: HtmlBody }}
      />
      <VStack overflow="scroll" alignItems="flex-start" w="full" h="full" maxW="260px">
        <Text fontWeight="semibold">Message events:</Text>
        {MessageEvents.map(({ Recipient, ReceivedAt, Type, Details }: any, key: number) => (
          <HStack key={key} justifyContent="space-between" w="full">
            <Box fontSize="xs">
              <Text color="gray.500">{format(new Date(ReceivedAt), 'dd MMM, yyy @ HH:mm')}</Text>
              <Text>{Recipient}</Text>
            </Box>
            <EventStatus type={Type} details={Details} />
          </HStack>
        ))}
      </VStack>
    </HStack>
  )
}

const EventStatus = ({ type, details }: any) => {
  const typeMap = {
    Delivered: 'delivered',
    Opened: 'opened',
    LinkClicked: 'link clicked',
    SubscriptionChanged: details?.SuppressSending === 'True' ? 'unsubscribed' : 'subscribed',
  } as any

  return (
    <Badge variant={typeMap[type]} size="xs">
      {typeMap[type]}
    </Badge>
  )
}
