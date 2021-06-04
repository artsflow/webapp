import { useContext, useState, useEffect } from 'react'
import { Text, Link, VStack, Button, List, ListItem, ListIcon } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { UserContext } from 'lib/context'
import { showAlert } from 'lib/utils'
import { Card } from 'components/UI'
import { createStripeAccountLinks, createStripeAccount, checkUserFirstTime } from 'api'
import { useAccountStatus } from 'hooks'
import { trackStartVerification } from 'analytics'
import { MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md'

export function Onboarding(): JSX.Element {
  const { user } = useContext(UserContext)

  useEffect(() => {
    checkUserFirstTime()
  }, [])

  return (
    <>
      <Card>
        <List spacing={3}>
          <ListItem>
            <ListIcon as={MdCheckCircle} color="af.teal" fontSize="1.2rem" />
            1.{' '}
            <Text as="span" textDecoration="line-through gray">
              Successfully register to the platform
            </Text>
          </ListItem>
          <ListItem>
            <ListIcon as={MdRadioButtonUnchecked} color="af.teal" fontSize="1.2rem" />
            2.{' '}
            <Text as="span" textDecoration="none">
              Verify your account
            </Text>
          </ListItem>
          <ListItem>
            <ListIcon as={MdRadioButtonUnchecked} color="af.teal" fontSize="1.2rem" />
            3.{' '}
            <Text as="span" textDecoration="none">
              Create your first activity (or event)
            </Text>
          </ListItem>
          <ListItem>
            <ListIcon as={MdRadioButtonUnchecked} color="af.teal" fontSize="1.2rem" />
            4.{' '}
            <Text as="span" textDecoration="none">
              Import your audience and send your first newsletter to announce your activity!
            </Text>
          </ListItem>
        </List>
      </Card>
      {!user.isVerified && <OnboardingVerification user={user} />}
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
