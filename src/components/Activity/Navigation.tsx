import React from 'react'
import { Flex, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { getCurrentStep, getPrevStep, getNextStep } from './utils'

export function Navigation({ isValid }: any): JSX.Element {
  const router = useRouter()

  const currentStep = getCurrentStep(router.asPath.split('/')[3])
  const prevStep = getPrevStep(currentStep)
  const nextStep = getNextStep(currentStep)

  const navigate = (step: string, dir: string) => {
    if (!isValid && dir === 'next') return
    const url = `/activities/add/${step}`
    router.push(url, url, { shallow: true })
  }

  return (
    <Flex bg="white" w="100%" justifyContent="space-between" p="1.5rem">
      {prevStep && (
        <Button bg="#edf8fa" color="#47BCC8" onClick={() => navigate(prevStep, 'prev')}>
          Back
        </Button>
      )}
      <Button bg="#47BCC8" color="white" ml="auto" onClick={() => navigate(nextStep, 'next')}>
        Continue
      </Button>
    </Flex>
  )
}
