import React from 'react'
import { Heading } from '@chakra-ui/react'

export default {
  h1: ({ children }: any) => (
    <Heading fontSize="xl" py="1rem">
      {children}
    </Heading>
  ),
  h2: ({ children }: any) => (
    <Heading fontSize="lg" as="h2" py="1rem">
      {children}
    </Heading>
  ),
}
