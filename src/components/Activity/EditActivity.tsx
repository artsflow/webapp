import { useEffect } from 'react'
import { Box, Flex, Heading, Text, VStack, Button } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { StateMachineProvider, useStateMachine } from 'little-state-machine'

import { steps, update } from 'components/Activity/utils'
import { firestore } from 'lib/firebase'
import { Preview } from './Preview'
import { InfoBulb } from './InfoBulb'
import { stepsMap } from './index'

export function EditActivity(): JSX.Element {
  const router = useRouter()
  const step = router.asPath.split('/')[4]

  const StepScreen = stepsMap[step] || <Flex />

  return (
    <StateMachineProvider>
      <Flex justifyContent="space-between" w="full" h="full">
        <Flex
          justifyContent="space-between"
          alignItems="flex-start"
          direction="column"
          pos="relative"
          flex="1"
          h="full"
        >
          <Box pos="absolute" right="0" m="2rem">
            <InfoBulb step={step || 'edit'} />
          </Box>
          {step ? <StepScreen /> : <EditButtons />}
        </Flex>
        <Preview />
      </Flex>
    </StateMachineProvider>
  )
}

interface StepsMapButtons {
  [key: string]: string
}

const stepsMapButtons: StepsMapButtons = {
  category: 'Category',
  details: 'Title & description',
  location: 'Location',
  images: 'Images',
  duration: 'Duration',
  frequency: 'Frequency',
  capacity: 'Capacity',
  price: 'Price',
}

const EditButtons = () => {
  const router = useRouter()
  const { actions } = useStateMachine({ update }) as any
  const id = router.asPath.split('/')[3]

  const [activity] = useDocumentData(firestore.doc(`/activities/${id}`))
  const [location] = useDocumentData(firestore.doc(`/locations/${id}`))
  console.log(id, activity, location)
  useEffect(() => {
    if (activity) {
      actions.update({
        ...activity,
        meta: { actionType: 'edit' },
        location,
      })
    }
  }, [activity, location])

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
          Edit your activity sections by using the buttons below.
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
            {stepsMapButtons[s]}
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
