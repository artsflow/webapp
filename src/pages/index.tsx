import { useContext, useState } from 'react'
import { Heading, Text, Box, Link, VStack, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { UserContext } from 'lib/context'
import { showAlert } from 'lib/utils'
import { Meta } from 'components'
import { createStripeAccountLinks, createStripeAccount } from 'api'
import { useAccountStatus } from 'hooks'

export default function Home(): JSX.Element {
  const { user } = useContext(UserContext)

  return (
    <>
      <Meta title="Artsflow" />
      <Box p="40px">
        <Heading fontSize="lg" mb="1rem">
          Welcome to Artsflow, {user.firstName}
        </Heading>
        {!user.isVerified && <OnboardingVerification user={user} />}
      </Box>
    </>
  )
}

const OnboardingVerification = ({ user }: any) => {
  const [status] = useAccountStatus()
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()

  const { moreInfoNeeded } = status

  const handleVerification = async () => {
    console.log('handleVerification')

    setLoading(true)
    let { stripeAccountId } = user

    if (!stripeAccountId) {
      const { data } = await createStripeAccount()
      if (!data) {
        showAlert({ title: 'Errror! Please try again.' })
        setLoading(false)
        return
      }
      stripeAccountId = data
    }

    const links = await createStripeAccountLinks({ stripeAccountId })
    router.push(links?.data.url)

    setLoading(false)
  }

  return (
    <VStack alignItems="flex-start">
      <Text color="af.pink" fontWeight="bold">
        Your account is not yet verified.
      </Text>
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
      <Button
        isLoading={isLoading}
        bg="af.teal"
        color="white"
        rounded="8px"
        mt="1rem"
        onClick={handleVerification}
      >
        Proceed with verification
      </Button>
    </VStack>
  )
}
