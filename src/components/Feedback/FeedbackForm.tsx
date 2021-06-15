import { useState } from 'react'
import {
  Button,
  chakra,
  Flex,
  Stack,
  Textarea,
  useColorModeValue,
  Heading,
  Text,
} from '@chakra-ui/react'
import * as React from 'react'
import { useRouter } from 'next/router'
import { useTimer } from 'react-timer-hook'
import { addSeconds } from 'date-fns'

import { addFeedback } from 'api'
import { useUserData } from 'hooks'
import { Loading } from 'components'
import { trackAddFeedback } from 'analytics'
import { FeedbackRadioGroup } from './FeedbackRatingGroup'
import { FeedbackSuccessPanel } from './FeedbackSuccessPanel'

interface Props {
  forwardedRef: React.MutableRefObject<null>
}

export const FeedbackForm = (props: Props) => {
  const { forwardedRef } = props
  const [message, setMessage] = useState('')
  const [emoji, setEmoji] = useState('')
  const [isSubmitted, setSubmitted] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const { user } = useUserData()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const feedbackData = {
      message,
      emoji,
      page: router.asPath,
      userId: user.id,
      displayName: user.displayName,
    }

    setLoading(true)
    await addFeedback(feedbackData)
    setLoading(false)
    setSubmitted(true)
    restart(addSeconds(new Date(), 15))
    trackAddFeedback(router.asPath)
  }

  const resetForm = () => {
    setMessage('')
    setEmoji('')
    setSubmitted(false)
  }

  const { restart } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: resetForm,
  })

  if (isLoading)
    return (
      <Flex h="180px" justifyContent="center">
        <Loading />
      </Flex>
    )
  if (isSubmitted) return <FeedbackSuccessPanel />

  return (
    <chakra.form onSubmit={handleSubmit}>
      <Stack spacing="3">
        <Heading as="h3" fontSize="sm">
          Help improve this page
        </Heading>
        <Text fontSize="xs">
          Is there anything you need on the <b>{router.asPath}</b> page?
        </Text>
        <Textarea
          ref={forwardedRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your Feedback"
          required
          focusBorderColor={useColorModeValue('blue.500', 'blue.300')}
          _placeholder={{
            opacity: 1,
            color: useColorModeValue('gray.500', 'whiteAlpha.700'),
          }}
          resize="none"
        />
        <Flex justifyContent="space-between">
          <FeedbackRadioGroup
            name="rating"
            options={['😍', '😀', '🤨', '😨']}
            onChange={setEmoji}
          />
          <Button type="submit" size="sm" variant="outline">
            Send
          </Button>
        </Flex>
      </Stack>
    </chakra.form>
  )
}
