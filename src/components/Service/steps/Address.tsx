import { useContext } from 'react'
import { Box, Heading } from '@chakra-ui/react'

import { AddressLookup } from 'components'
import { Context } from '../machine'

export function Address() {
  const { send, context } = useContext(Context) as any
  const { address } = context

  const handleAddress = (selectedAddress: any) => {
    send({ type: 'UPDATE', data: { address: selectedAddress, meta: { isDirty: true } } })
  }

  return (
    <Box w="full">
      <Heading mb="4" size="lg">
        Address
      </Heading>
      <AddressLookup address={address} onAddress={handleAddress} />
    </Box>
  )
}
