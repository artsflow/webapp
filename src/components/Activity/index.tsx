import React from 'react'
import { Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { StateMachineProvider, createStore } from 'little-state-machine'

import { Preview } from './Preview'
import { Category, Details, Location } from './steps'

import { getCurrentStep, DevTool } from './utils'

createStore({
  category: '',
  title: '',
  description: '',
  whatToBring: '',
  locationAddress: '',
  locationDetails: '',
  locationGeocode: {},
  locationPlaceId: '',
})

interface StepsMap {
  [key: string]: React.FC
}

export const stepsMap: StepsMap = {
  category: Category,
  details: Details,
  location: Location,
}

export function Activity(): JSX.Element {
  const { asPath } = useRouter()
  const currentStep = getCurrentStep(asPath.split('/')[3])
  const Screen = stepsMap[currentStep]

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
