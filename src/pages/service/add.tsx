import { Box, Heading } from '@chakra-ui/core'
import { Meta, Service } from 'components'

export default function ManageService() {
  return (
    <>
      <Meta title="Add Service" />
      <Box>
        <Heading size="md" mb="2">
          Add Service
        </Heading>
        <Service />
      </Box>
    </>
  )
}
