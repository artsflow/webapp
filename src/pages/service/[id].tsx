import { Box } from '@chakra-ui/core'
import { Meta, Service } from 'components'
import { useRouter } from 'next/router'

import { useService } from 'hooks/services'

export default function ManageService() {
  const { query } = useRouter()
  const { id } = query
  const { data, loading } = useService(id as string)

  console.log(data, loading)

  return (
    <>
      <Meta title="Service" />
      <Box w="50%">
        <Service data={data} />
      </Box>
    </>
  )
}
