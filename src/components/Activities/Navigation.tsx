import React from 'react'
import { Box, Flex, Button } from '@chakra-ui/react'

export function Navigation(): JSX.Element {
  return (
    <Flex bg="white" w="100%" justifyContent="space-between" p="1.5rem">
      <Box />
      <Button bg="#47BCC8" color="white">
        Continue
      </Button>
    </Flex>
  )
}
