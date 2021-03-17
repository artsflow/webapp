import { useEffect } from 'react'
import { Box, Flex, Heading, Text, VStack, Button } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { StateMachineProvider, useStateMachine } from 'little-state-machine'

import { steps, update } from 'components/Activity/utils'
import { firestore } from 'lib/firebase'
import { Preview } from './Preview'

interface StepsMap {
  [key: string]: string
}

const stepsMap: StepsMap = {
  category: 'Category',
  details: 'Title & description',
  location: 'Location',
  images: 'Images',
  duration: 'Duration',
  frequency: 'Frequency',
  capacity: 'Capacity',
  price: 'Price',
}

export function EditActivity(): JSX.Element {
  const router = useRouter()
  const step = router.asPath.split('/')[4]

  useEffect(() => {
    console.log('step change:', step)
  }, [step])

  return (
    <StateMachineProvider>
      <Flex justifyContent="space-between" w="full" h="full">
        <Flex
          justifyContent="space-between"
          alignItems="flex-start"
          direction="column"
          flex="1"
          h="full"
        >
          <EditButtons />
        </Flex>
        <Preview />
      </Flex>
    </StateMachineProvider>
  )
}

const EditButtons = () => {
  const router = useRouter()
  const { actions } = useStateMachine({ update }) as any
  const id = router.asPath.split('/')[3]

  const [activity] = useDocumentData(firestore.doc(`/activities/${id}`))

  useEffect(() => {
    if (activity) {
      actions.update({ ...activity, meta: { actionType: 'edit' } })
    }
  }, [activity])

  const handleEdit = (step: string) => {
    const url = `/activities/edit/${id}/${step}`
    router.push(url, url, { shallow: true })
  }

  return (
    <Box p="40px">
      <Flex direction="column" alignItems="flex-start">
        <Heading size="md" mb="1rem" fontSize="1.5rem">
          What do you want to modify?
        </Heading>
        <Text color="#616167" mb="2rem">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </Text>
      </Flex>
      <VStack w="320px" spacing="0.5rem">
        {steps.slice(0, 8).map((s) => (
          <StyledButton
            key={s}
            w="full"
            justifyContent="flex-start"
            p="1rem"
            bg="white"
            fontSize="xs"
            pos="relative"
            onClick={() => handleEdit(s)}
          >
            {stepsMap[s]}
          </StyledButton>
        ))}
      </VStack>
    </Box>
  )
}

const StyledButton = styled(Button)`
  &:hover {
    background-color: white;

    &::before {
      content: 'Edit';
      position: absolute;
      color: #47bcc8;
      right: 1rem;
      top: 13px;
    }
  }
`
