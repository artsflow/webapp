import React from 'react'
import { Text, Box, Heading, HStack, VStack, Button } from '@chakra-ui/react'
import Link from 'next/link'

import { Meta } from 'components'

export default function Activities(): JSX.Element {
  return (
    <>
      <Meta title="My Activities" />
      <Box w="100%" p="40px">
        <HStack justifyContent="space-between" alignItems="flex-start">
          <VStack alignItems="flex-start">
            <Heading size="md" mb="1rem">
              My activities
            </Heading>
            <Text color="#616167">View all of your ongoing activities here.</Text>
          </VStack>
          <VStack>
            <Link as="/activities/add" href="/activities/add">
              <Button bg="af.teal" color="white" as="a" cursor="pointer">
                + Add activity
              </Button>
            </Link>
          </VStack>
        </HStack>
      </Box>
    </>
  )
}
