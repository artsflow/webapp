import { useContext } from 'react'
import { Heading, Text, Box, Link, Skeleton, VStack } from '@chakra-ui/react'

import { useAccountStatus } from 'hooks'
import { UserContext } from 'lib/context'
import { Meta } from 'components'

export default function Home(): JSX.Element {
  const { user } = useContext(UserContext)
  const [status, loading] = useAccountStatus()

  console.log(status)

  return (
    <>
      <Meta title="Artsflow" />
      <Box p="40px">
        <Heading fontSize="lg" mb="1rem">
          Welcome to Artsflow, {user.firstName}
        </Heading>
        <Skeleton isLoaded={!loading}>
          {!status?.verified && <OnboardingVerification status={status} />}
        </Skeleton>
      </Box>
    </>
  )
}

const OnboardingVerification = ({ status }: any) => {
  const moreInfoNeeded =
    status?.requirements?.pending_verification?.length > 0 ||
    status?.requirements?.errors?.length > 0
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
      <Link
        href={status?.onboardingUrl}
        bg="af.teal"
        color="white"
        padding="2"
        px="4"
        rounded="8px"
        mt="1rem"
      >
        Proceed with verification
      </Link>
    </VStack>
  )
}
