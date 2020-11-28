import { Box, Heading } from '@chakra-ui/core'
import { Meta, Service } from 'components'
import { useRouter } from 'next/router'

import { useService, fetchService } from 'hooks/services'

export default function ManageService({ initialData }: any) {
  const { query } = useRouter()
  const { id } = query
  const { data, loading } = useService(id as string, initialData)

  console.log('ManageService', data, loading)

  return (
    <>
      <Meta title="Service" />
      <Box w="50%">
        <Heading size="md" mb="2">
          Edit Service
        </Heading>
        <Service id={id} data={data} />
      </Box>
    </>
  )
}

export async function getServerSideProps(context: any) {
  const {
    query: { id },
    req,
  } = context

  const initialData = await fetchService(id, req.headers.cookie)
  return { props: { initialData } }
}
