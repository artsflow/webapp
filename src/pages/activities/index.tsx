import React, { useContext } from 'react'
import { Text, Flex, Box, Heading, HStack, VStack, Button, SimpleGrid } from '@chakra-ui/react'
import Link from 'next/link'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { Meta } from 'components'
import { firestore } from 'lib/firebase'
import { UserContext } from 'lib/context'
import { ActivityCard } from 'components/Activity/ActivityCard'

export default function Activities(): JSX.Element {
  const { user } = useContext(UserContext)
  const [activities] = useCollectionData(
    user.id && firestore.collection('activities').where('userId', '==', user.id),
    {
      idField: 'id',
    }
  )

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
            {activities?.map((activity) => (
              <ActivityCard key={activity.id} {...activity} />
            ))}
          </SimpleGrid>
        </Flex>
      </Box>
    </>
  )
}
