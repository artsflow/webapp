import React from 'react'
import { Flex, Button, HStack, Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { steps, useCurrentStep, getPrevStep, getNextStep, isLastStep } from './utils'

export function Navigation({ isValid, onClick }: any): JSX.Element {
  const router = useRouter()

  const [currentStep] = useCurrentStep()
  const prevStep = getPrevStep(currentStep)
  const nextStep = getNextStep(currentStep)

  const navigate = (step: string, dir: string) => {
    if (onClick) onClick()
    if (!isValid && dir === 'next') return
    const url = `/activities/add/${step}`
    router.push(url, url, { shallow: true })
  }

  return (
    <Flex bg="white" w="100%" justifyContent="space-between" p="1.5rem">
      {prevStep ? (
        <Box w="70px">
          <Button bg="#edf8fa" color="#47BCC8" onClick={() => navigate(prevStep, 'prev')}>
            Back
          </Button>
        </Box>
      ) : (
        <Box w="70px" />
      )}
      <HStack spacing="12px">
        {steps.map((s) => (
          <Box
            key={s}
            w="5px"
            h="5px"
            rounded="full"
            bg={s === currentStep ? 'af.teal' : 'gray.400'}
          />
        ))}
      </HStack>
      <Button bg="#47BCC8" color="white" onClick={() => navigate(nextStep, 'next')}>
        {isLastStep(currentStep) ? 'Publish' : 'Continue'}
      </Button>
    </Flex>
  )
}
