import { VStack, Icon, Text, useColorModeValue, StackProps } from '@chakra-ui/react'
import React from 'react'
import { FiCheckCircle } from 'react-icons/fi'

export const FeedbackSuccessPanel = (props: StackProps) => (
  <VStack spacing="0" justify="center" py="1rem" {...props}>
    <Icon
      fontSize="40px"
      as={FiCheckCircle}
      mb="4"
      color={useColorModeValue('af.teal', 'af.teal')}
    />
    <Text fontSize="sm" lineHeight="short" textAlign="center">
      We have received your feedback.
    </Text>
    <Text fontSize="sm" lineHeight="short" textAlign="center">
      Thank you for your help.
    </Text>
  </VStack>
)
