import React, { useEffect } from 'react'
import { Flex, Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { StateMachineProvider, createStore, useStateMachine } from 'little-state-machine'

import { Preview } from './Preview'
import {
  Options,
  Category,
  Details,
  Location,
  Images,
  Duration,
  Dates,
  Capacity,
  Price,
  Published,
} from './steps'

import { initialStore, resetStore, steps, useCurrentStep, DevTool } from './utils'
import { InfoBulb } from './InfoBulb'

createStore(initialStore, {
  storageType: process.browser ? window.localStorage : ({} as Storage),
  name: '__AF__',
  middleWares: [],
})

interface StepsMap {
  [key: string]: React.FC
}

export const stepsMap: StepsMap = {
  options: Options,
  category: Category,
  details: Details,
  location: Location,
  images: Images,
  duration: Duration,
  dates: Dates,
  capacity: Capacity,
  price: Price,
  published: Published,
}

export function Activity(): JSX.Element {
  const [currentStep, stepFromUrl] = useCurrentStep()
  const { push } = useRouter()
  const StepScreen = stepsMap[currentStep] || <Flex />

  useEffect(() => {
    if (!steps.includes(stepFromUrl)) {
      const url = `/activities/add/options`
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
          pos="relative"
          flex="1"
          h="full"
        >
          <Box pos="absolute" right="0" m="2rem">
            <InfoBulb step={currentStep} />
          </Box>
          <StepScreen />
        </Flex>
        <Preview />
        <StoreChecker />
      </Flex>
    </StateMachineProvider>
  )
}

export const StoreChecker = () => {
  const { state, actions } = useStateMachine({ resetStore }) as any

  useEffect(() => {
    if (state.meta.actionType === 'edit') {
      actions.resetStore()
    }
  }, [])

  return null
}
