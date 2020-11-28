import { VStack } from '@chakra-ui/core'
import { useMachine } from '@xstate/react'

import { Category, Title, Description, Complete, Address } from './steps'
import { serviceMachine, Context, defaultContext } from './machine'
import { Navigation } from './Navigation'

interface StepsMap {
  [key: string]: React.FC
}

const stepsMap: StepsMap = {
  category: Category,
  title: Title,
  description: Description,
  complete: Complete,
  address: Address,
}

export function Service({ data }: any) {
  // console.log('Service data:', data)
  const [machine, send] = useMachine(serviceMachine.withContext(data || defaultContext))
  const { context, value } = machine
  const currentStep = value as string
  const Screen = stepsMap[currentStep]
  // console.log('Service ctx:', context)

  return (
    <Context.Provider value={{ context, send }}>
      <VStack border="1px" p="4" h="60vh" justify="space-between">
        <Screen />
        <Navigation step={currentStep} />
      </VStack>
    </Context.Provider>
  )
}
