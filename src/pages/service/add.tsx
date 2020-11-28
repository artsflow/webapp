import { Box, Heading } from '@chakra-ui/core'
import { Meta, Service } from 'components'

export default function ManageService() {
  return (
    <>
      <Meta title="Add Service" />
      <Heading size="md" mb="2">
        Add Service
      </Heading>
      <Box w="50%">
        <Service />
      </Box>
    </>
  )
}
