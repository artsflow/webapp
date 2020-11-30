import { VStack } from '@chakra-ui/core'
import { useMachine } from '@xstate/react'

import {
  Category,
  Title,
  Description,
  Complete,
  Address,
  Images,
  Video,
  Duration,
  Frequency,
  Capacity,
  Price,
} from './steps'
import { makeServiceMachine, Context } from './machine'
import { Navigation } from './Navigation'

interface StepsMap {
  [key: string]: React.FC
}

const stepsMap: StepsMap = {
  category: Category,
  title: Title,
  description: Description,
  address: Address,
  images: Images,
  video: Video,
  duration: Duration,
  frequency: Frequency,
  capacity: Capacity,
  price: Price,
  complete: Complete,
}

export function Service({ data }: any) {
  const [machine, send] = useMachine(makeServiceMachine(data?.step), {
    context: data,
    devTools: true,
  })
  const { context, value } = machine
  const currentStep = value as string
  const Screen = stepsMap[currentStep]

  return (
    <Context.Provider value={{ context, send }}>
      <VStack border="1px" p="4" h="60vh" justify="space-between">
        <Screen />
        <Navigation step={currentStep} />
      </VStack>
    </Context.Provider>
  )
}
