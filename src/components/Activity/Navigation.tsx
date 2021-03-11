import React from 'react'
import { Flex, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { getCurrentStep, getPrevStep, getNextStep } from './config'

export function Navigation(): JSX.Element {
  const router = useRouter()

  const currentStep = getCurrentStep(router.asPath.split('/')[3])
  const prevStep = getPrevStep(currentStep)
  const nextStep = getNextStep(currentStep)

  const navigate = (step: string) => {
    const url = `/activities/add/${step}`
    router.push(url, url, { shallow: true })
  }

  return (
    <Flex bg="white" w="100%" justifyContent="space-between" p="1.5rem">
      {prevStep && (
        <Button bg="#edf8fa" color="#47BCC8" onClick={() => navigate(prevStep)}>
          Back
        </Button>
      )}
      <Button bg="#47BCC8" color="white" ml="auto" onClick={() => navigate(nextStep)}>
        Continue
      </Button>
    </Flex>
  )
}
