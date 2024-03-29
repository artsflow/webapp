import { Heading, Text, Box, Link, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'

import { useAccountStatus } from 'hooks'
import { Meta } from 'components'
import { Balance, PayoutsData, AddBankAccount } from 'components/Payouts'

export default function Payouts() {
  const [status, loading] = useAccountStatus()
  const isVerified = status?.verified === true
  const hasPayoutsEnabled = status?.payouts_enabled === true

  return (
    <>
      <Meta title="Payouts" />
      <Box p="40px">
        <Heading fontSize="lg" mb="1rem">
          Payouts
        </Heading>
        <VStack alignItems="flex-start">
          {isVerified && hasPayoutsEnabled && <Balance />}
          {isVerified && hasPayoutsEnabled && <PayoutsData />}
          {isVerified && !hasPayoutsEnabled && !loading && <AddBankAccount />}
        </VStack>
        {!isVerified && (
          <Text as="span">
            You need to {` `}
            <NextLink href="/" passHref>
              <Link>
                <Text as="span" color="af.pink" fontWeight="bold">
                  verify your account
                </Text>
              </Link>
            </NextLink>
            {` `}in order to access the payouts
          </Text>
        )}
      </Box>
    </>
  )
}
