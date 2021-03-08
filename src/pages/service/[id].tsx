import { Box, Heading } from '@chakra-ui/react'
import { Meta, Service } from 'components'
import { useRouter } from 'next/router'

export default function ManageService() {
  const { query } = useRouter()
  const { id } = query

  return (
    <>
      <Meta title="Service" />
      <Box>
        <Heading size="md" mb="2">
          Edit Service
        </Heading>
        <Service id={id} data={null} />
      </Box>
    </>
  )
}
