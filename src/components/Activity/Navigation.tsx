import { useState } from 'react'
import { Flex, Button, HStack, Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useStateMachine } from 'little-state-machine'

import { addActivity, editActivity } from 'api'
import { showAlert } from 'lib/utils'
import { trackUpdateActivity } from 'analytics'
import {
  steps,
  resetStore,
  cleanStore,
  useCurrentStep,
  getPrevStep,
  getNextStep,
  isLastStep,
  isValidState,
} from './utils'

export function Navigation({ isValid, onClick }: any): JSX.Element {
  const { state, actions } = useStateMachine({ resetStore }) as any
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()

  const [currentStep] = useCurrentStep()

  let skipPrev = 0
  let skipNext = 0

  if (state.activityPresence === 'Online' && currentStep === 'details') skipNext = 1
  if (state.activityPresence === 'Online' && currentStep === 'images') skipPrev = 1

  const prevStep = getPrevStep(currentStep, skipPrev)
  const nextStep = getNextStep(currentStep, skipNext)

  const isEdit = state.meta.actionType === 'edit'

  const navigate = (step: string, dir: string) => {
    if (onClick) onClick()
    if (!isValid && dir === 'next') {
      showAlert({ title: 'Error! You need to make a selection.' })
      return
    }
    const url = `/activities/add/${step}`
    router.push(url, url, { shallow: true })
  }

  const handleClick = async () => {
    if (!isValidState(state)) {
      showAlert({ title: 'Error! You need to make a selection.' })
      return
    }

    if (isLastStep(currentStep)) {
      setLoading(true)
      const result = await addActivity(cleanStore(state))
      setLoading(false)
      const url = `/activities/add/${nextStep}/${result?.data}`
      router.push(url, url, { shallow: true })
      actions.resetStore()
    } else {
      navigate(nextStep, 'next')
    }
  }

  const handleSave = async () => {
    if (onClick) onClick()
    if (!isValid) {
      showAlert({ title: 'Error! You need to make a selection.' })
      return
    }

    setLoading(true)
    const id = router.asPath.split('/')[3]
    const data = { ...cleanStore(state), id }
    const result = await editActivity(data)

    if (result) {
      showAlert({ title: 'Information updated.', status: 'success' })
      trackUpdateActivity({ id, ...state })
    } else {
      showAlert({ title: 'Information not updated.' })
    }

    setLoading(false)
    router.back()
  }

  if (isEdit)
    return (
      <Flex bg="white" w="100%" justifyContent="space-between" p="1.5rem">
        <Box w="70px">
          <Button bg="#edf8fa" color="#47BCC8" onClick={() => router.back()} isLoading={isLoading}>
            Back
          </Button>
        </Box>
        <Button bg="#47BCC8" color="white" onClick={handleSave} isLoading={isLoading}>
          Save
        </Button>
      </Flex>
    )

  return (
    <Flex bg="white" w="100%" justifyContent="space-between" p="1.5rem">
      {prevStep ? (
        <Box w="70px">
          <Button
            bg="#edf8fa"
            color="#47BCC8"
            onClick={() => navigate(prevStep, 'prev')}
            isLoading={isLoading}
          >
            Back
          </Button>
        </Box>
      ) : (
        <Box w="70px" />
      )}
      <HStack spacing="12px">
        {steps.slice(0, 8).map((s) => (
          <Box
            key={s}
            w="5px"
            h="5px"
            rounded="full"
            bg={s === currentStep ? 'af.teal' : 'gray.400'}
          />
        ))}
      </HStack>
      <Button bg="#47BCC8" color="white" onClick={handleClick} isLoading={isLoading}>
        {isLastStep(currentStep) ? 'Publish' : 'Continue'}
      </Button>
    </Flex>
  )
}
