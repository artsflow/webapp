import React, { useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { StateMachineProvider, createStore } from 'little-state-machine'

import { Preview } from './Preview'
import { Category, Details, Location } from './steps'

import { steps, getCurrentStep, DevTool } from './utils'

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
  const { asPath, push } = useRouter()
  const [, , , step, id] = asPath.split('/')
  console.log(step, id)
  const currentStep = getCurrentStep(step)
  const Screen = stepsMap[currentStep]

  useEffect(() => {
    console.log('effect', step)
    if (!steps.includes(step)) {
      const url = `/activities/add`
      push(url, url, { shallow: true })
      console.log('!!!!')
    }
  }, [step])

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
