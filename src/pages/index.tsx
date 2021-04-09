import { useContext } from 'react'
import { Heading, Text, Box, Link } from '@chakra-ui/react'

import { useAccountStatus } from 'hooks'
import { UserContext } from 'lib/context'

export default function Home(): JSX.Element {
  const { user } = useContext(UserContext)
  const [status, loading] = useAccountStatus()

  return (
    <Box p="40px">
      <Heading fontSize="lg" mb="1rem">
        Welcome to Artsflow, {user.firstName}
      </Heading>
      {!loading && !status.verified && <OnboardingVerification url={status.onboardingUrl} />}
    </Box>
  )
}

const OnboardingVerification = ({ url }: any) => (
  <>
    <Text color="af.pink" fontWeight="bold">
      Your account is not yet verified.
    </Text>
    <Text>In order to get fully onboarded and accept payments, you need to get verified</Text>
    <Text mb="1rem">
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
    <Link href={url} bg="af.teal" color="white" padding="2" px="4" rounded="8px">
      Proceed with verification
    </Link>
  </>
)
