import { useState } from 'react'
import { Text, Link, VStack, Button, HStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { showAlert } from 'lib/utils'
import { createStripeAccountLinks, createStripeAccount } from 'api'
import { useAccountStatus, useUserData } from 'hooks'
import { trackStartVerification } from 'analytics'

export const AccountVerification = () => {
  const [status] = useAccountStatus()
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useUserData()

  const { moreInfoNeeded } = status

  const handleVerification = async () => {
    console.log('handleVerification')

    setLoading(true)
    let { stripeAccountId } = user

    if (!stripeAccountId) {
      const { data } = await createStripeAccount()
      if (!data) {
        showAlert({ title: 'Error! Please try again.' })
        setLoading(false)
        return
      }
      stripeAccountId = data
    }

    trackStartVerification()
    const links = await createStripeAccountLinks({ stripeAccountId })
    router.push(links?.data.url)

    setLoading(false)
  }

  return (
    <VStack alignItems="flex-start">
      <Text>In order to get fully onboarded and accept payments, you need to get verified</Text>
      <Text>
        To make this process simpler,{' '}
        <Link href="https://stripe.com/" textDecor="underline" isExternal>
          Stripe
        </Link>{' '}
        will do all the{' '}
        <Link
          textDecor="underline"
          href="https://en.wikipedia.org/wiki/Know_your_customer"
          isExternal
        >
          KYC and AML
        </Link>{' '}
        checks.
      </Text>
      {moreInfoNeeded && <Text color="red">Additional information is needed!</Text>}
      <HStack spacing="1rem">
        <Button
          isLoading={isLoading}
          isDisabled={user.isVerified}
          variant="primary"
          onClick={handleVerification}
        >
          Proceed with verification
        </Button>
        <Text color="gray.500" fontSize="sm">
          5 minutes to complete
        </Text>
      </HStack>
    </VStack>
  )
}
