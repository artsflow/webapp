import { useState } from 'react'
import Link from 'next/link'
import { Text, HStack, Button, Link as ChakraLink } from '@chakra-ui/react'

import { giveConsent } from 'api'
import { Card } from 'components/UI'
import { useUserData } from 'hooks'

export const ConsentBox = () => {
  const [loading, setLoading] = useState(false)
  const { user } = useUserData()

  const handleConsent = async () => {
    setLoading(true)
    await giveConsent()
    setLoading(false)
  }

  if (user.hasConsent) return null

  return (
    <Card variant="white" maxW="770px">
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
        <Button isLoading={loading} onClick={handleConsent} variant="important">
          I consent
        </Button>
      </HStack>
    </Card>
  )
}
