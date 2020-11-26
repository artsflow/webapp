import { Box } from '@chakra-ui/core'
import { Meta, Service } from 'components'

export default function ManageService() {
  return (
    <>
      <Meta title="Service" />
      <Box w="50%">
        <Service />
      </Box>
    </>
  )
}
