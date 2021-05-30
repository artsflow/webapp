import { useState } from 'react'
import Link from 'next/link'
import { VStack, Input, Text, HStack, Button, Link as ChakraLink } from '@chakra-ui/react'

import { Card } from 'components/UI'
import { useUserData } from 'hooks'
import { giveConsent } from 'api'

export const Add = () => {
  const { user } = useUserData()
  const isDisabled = !user.hasConsent

  const handleAdd = async () => {
    console.log('handleAdd')
  }

  const handleCSVImport = async () => {
    console.log('handleCSVImport')
  }

  return (
    <VStack maxW="800px" spacing="1rem" alignItems="flex-start">
      <ConsentBox />
      <HStack spacing="1rem" w="full">
        <Input w="full" variant="af" placeholder="Enter name..." />
        <Input w="full" variant="af" placeholder="Enter email..." type="email" />
        <Button variant="primary" disabled={isDisabled} onClick={handleAdd}>
          Add
        </Button>
        <Button
          variant="secondary"
          w="full"
          minW="220px"
          disabled={isDisabled}
          onClick={handleCSVImport}
        >
          Add multiple (CSV import)
        </Button>
      </HStack>
    </VStack>
  )
}

const ConsentBox = () => {
  const [loading, setLoading] = useState(false)
  const { user } = useUserData()

  const handleConsent = async () => {
    setLoading(true)
    const consent = await giveConsent()
    console.log('consent', consent)
    setLoading(false)
  }

  if (user.hasConsent) return null

  return (
    <Card variant="white">
      <HStack spacing="1rem">
        <Text>
          Before start importing my audience into Artsflow platform, I consnt I have perimission
          from the recipients to send them emails. See our{` `}
          <Link as="/terms" href="/terms" passHref>
            <ChakraLink isExternal textDecor="underline" color="af.pink">
              Terms of Service
            </ChakraLink>
          </Link>
          {` `} for more information.
        </Text>
        <Button disabled={loading} onClick={handleConsent} variant="important">
          I consent
        </Button>
      </HStack>
    </Card>
  )
}
