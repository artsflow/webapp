import { useState, useEffect } from 'react'
import { Flex, Button, HStack, Box, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useStateMachine } from 'little-state-machine'

import { addActivity, editActivity } from 'api'
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
  const toast = useToast()

  const [currentStep] = useCurrentStep()
  const prevStep = getPrevStep(currentStep)
  const nextStep = getNextStep(currentStep)

  const isEdit = state.meta.actionType === 'edit'

  const navigate = (step: string, dir: string) => {
    if (onClick) onClick()
    if (!isValid && dir === 'next') return
    const url = `/activities/add/${step}`
    router.push(url, url, { shallow: true })
  }

  const handleClick = async () => {
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
    setLoading(true)
    const id = router.asPath.split('/')[3]
    const data = { ...cleanStore(state), id }
    const result = await editActivity(data)

    if (result) {
      toast({
        title: 'Information updated',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top',
      })
    } else {
      toast({
        title: 'Information not updated',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top',
      })
    }

    setLoading(false)
    router.back()
  }

  useEffect(() => {
    if (!isValidState(state)) {
      router.push('/activities/add')
    }
  }, [currentStep])

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
