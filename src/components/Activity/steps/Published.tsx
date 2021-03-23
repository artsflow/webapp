import { useEffect, useState } from 'react'
import { Flex, Text, Heading, Button, VStack, useClipboard, Input } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Confetti from 'react-dom-confetti'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { useTimeoutWhen } from 'rooks'

import { firestore } from 'lib/firebase'
import { artsflowUrl } from 'lib/config'
import { ActivityCard } from '../ActivityCard'

const config = {
  angle: 90,
  spread: 200,
  startVelocity: 69,
  elementCount: 188,
  dragFriction: 0.15,
  duration: 8200,
  stagger: 6,
  width: '12px',
  height: '12px',
  perspective: '942px',
  colors: ['#45BCC8', '#765EA6', '#E27CB0', '#FCCE36'],
}

export function Published() {
  const [confettiActive, setConfettiActive] = useState(false)
  const [url, setUrl] = useState(artsflowUrl)
  const { hasCopied, onCopy } = useClipboard(url)
  const router = useRouter()
  useTimeoutWhen(() => setConfettiActive(true), 1000)

  const id = router.asPath.split('/')[4]
  const [activity, loading, error] = useDocumentDataOnce(firestore.doc(`/activities/${id}`))

  useEffect(() => {
    setUrl(`${url}/a/${id}`)
  }, [])

  // TODO: display error message
  if (error) return null

  return (
    <>
      <VStack
        direction="column"
        justifyContent="center"
        alignItems="center"
        pos="relative"
        h="100%"
        w="100%"
        spacing="1rem"
      >
        <Confetti active={confettiActive} config={config} />
        <ActivityCard {...activity} id={id} loading={!activity || loading} />
        <Heading fontSize="1.5rem" pt="2rem" mb="1rem">
          Awesome, your activity was publised!
        </Heading>
        <Text color="#616167" fontSize="sm">
          Below is your activity link. You can share it and accept bookings.
        </Text>
        <Flex mb={2}>
          <Input value={url} isReadOnly fontSize="sm" w="240px" />
          <Button onClick={onCopy} ml={2} fontSize="sm" w="80px">
            {hasCopied ? 'Copied' : 'Copy'}
          </Button>
        </Flex>

        <Button
          bg="af.teal"
          color="white"
          px="1.5rem"
          rounded="0.5rem"
          fontSize="sm"
          onClick={() => router.push('/activities')}
        >
          Go to “My Activities”
        </Button>
      </VStack>
    </>
  )
}
