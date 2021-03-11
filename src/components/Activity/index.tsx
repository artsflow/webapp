import React from 'react'
import { Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { Category, Details } from './steps'
import { Preview } from './Preview'
import { Navigation } from './Navigation'
import { getCurrentStep } from './config'

interface StepsMap {
  [key: string]: React.FC
}

const stepsMap: StepsMap = {
  category: Category,
  details: Details,
}

export function Activity(): JSX.Element {
  const { asPath } = useRouter()
  const currentStep = getCurrentStep(asPath.split('/')[3])
  const Screen = stepsMap[currentStep]

  return (
    <Flex justifyContent="space-between" w="full" h="full">
      <Flex
        justifyContent="space-between"
        alignItems="flex-start"
        direction="column"
        flex="1"
        h="full"
      >
        <Screen />
        <Navigation />
      </Flex>
      <Preview />
    </Flex>
  )
}
