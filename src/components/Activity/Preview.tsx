import React from 'react'
import { Flex, Heading } from '@chakra-ui/react'

import { MockiPhone } from './Phone'

export function Preview(): JSX.Element {
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      borderLeft="1px solid #ECEDF1"
      p="40px"
    >
      <Heading fontSize="0.75rem" mb="1.5rem">
        Activity Preview
      </Heading>
      <MockiPhone />
    </Flex>
  )
}
