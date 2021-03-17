import React, { useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { StateMachineProvider, createStore, useStateMachine } from 'little-state-machine'

import { Preview } from './Preview'
import {
  Category,
  Details,
  Location,
  Images,
  Duration,
  Frequency,
  Capacity,
  Price,
  Published,
} from './steps'

import { initialStore, resetStore, steps, useCurrentStep, DevTool } from './utils'

createStore(initialStore)

interface StepsMap {
  [key: string]: React.FC
}

export const stepsMap: StepsMap = {
  category: Category,
  details: Details,
  location: Location,
  images: Images,
  duration: Duration,
  frequency: Frequency,
  capacity: Capacity,
  price: Price,
  published: Published,
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
        <StoreChecker />
      </Flex>
    </StateMachineProvider>
  )
}

const StoreChecker = () => {
  const { state, actions } = useStateMachine({ resetStore }) as any

  useEffect(() => {
    if (state.meta.actionType === 'edit') {
      actions.resetStore()
    }
  }, [])

  return null
}
