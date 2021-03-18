import React from 'react'
import { Text, Flex, Box, Heading, HStack, VStack, Button, SimpleGrid } from '@chakra-ui/react'
import Link from 'next/link'

import { Meta } from 'components'
import { useActivities } from 'hooks'
import { ActivityCard } from 'components/Activity/ActivityCard'

export default function Activities(): JSX.Element {
  const [activities] = useActivities()

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
        <Flex>
          <SimpleGrid columns={[1, 1, 1, 2, 3, 3]} spacing="1.5rem" mt="2rem">
            {activities?.map((activity: any) => (
              <ActivityCard key={activity.id} {...activity} />
            ))}
          </SimpleGrid>
        </Flex>
      </Box>
    </>
  )
}
