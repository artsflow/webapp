import React from 'react'
import { Flex } from '@chakra-ui/react'

import { Category } from './steps'
import { Preview } from './Preview'
import { Navigation } from './Navigation'

export function Activities(): JSX.Element {
  return (
    <Flex justifyContent="space-between" w="full" h="full">
      <Flex
        justifyContent="space-between"
        alignItems="flex-start"
        direction="column"
        flex="1"
        h="full"
      >
        <Category />
        <Navigation />
      </Flex>
      <Preview />
    </Flex>
  )
}
