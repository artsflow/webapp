import React, { useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { StateMachineProvider, createStore } from 'little-state-machine'

import { Preview } from './Preview'
import { Category, Details, Location, Images } from './steps'

import { steps, useCurrentStep, DevTool } from './utils'

createStore({
  category: '',
  title: '',
  description: '',
  whatToBring: '',
  locationAddress: '',
  locationDetails: '',
  locationGeocode: {},
  locationPlaceId: '',
  images: [],
})

interface StepsMap {
  [key: string]: React.FC
}

export const stepsMap: StepsMap = {
  category: Category,
  details: Details,
  location: Location,
  images: Images,
}

export function Activity(): JSX.Element {
  const [currentStep, stepFromUrl] = useCurrentStep()
  const { push } = useRouter()
  const Screen = stepsMap[currentStep] || <Flex />

  useEffect(() => {
    if (!steps.includes(stepFromUrl)) {
      const url = `/activities/add/category`
      push(url, url, { shallow: true })
    }
  }, [currentStep])

  return (
    <StateMachineProvider>
      {process.env.NODE_ENV !== 'production' && <DevTool />}
      <Flex justifyContent="space-between" w="full" h="full">
        <Flex
          justifyContent="space-between"
          alignItems="flex-start"
          direction="column"
          flex="1"
          h="full"
        >
          <Screen />
        </Flex>
        <Preview />
      </Flex>
    </StateMachineProvider>
  )
}
