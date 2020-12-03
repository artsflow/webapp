import { useState } from 'react'
import { useRouter } from 'next/router'
import { Text, Grid, VStack, HStack, Button } from '@chakra-ui/core'

import { Meta } from 'components'
import { useServices } from 'hooks/services'

export default function ListServices() {
  const { data, toggleService } = useServices()

  return (
    <>
      <Meta title="List services" />
      <Text>List services</Text>
      <Grid mt="8" pos="relative" templateColumns="repeat(auto-fit, 240px)" gap={6}>
        {data?.map((serviceData: any) => (
          <Service key={serviceData.id} {...serviceData} toggleService={toggleService} />
        ))}
      </Grid>
    </>
  )
}

const Service = ({ id, title, step, published, toggleService }: any) => {
  const [loadingValue, setLoading] = useState(false)
  const router = useRouter()
  const isCompleted = step === 'complete'

  const handleToggle = async () => {
    setLoading(true)
    await toggleService(id)
    setLoading(false)
  }

  const handleEdit = () => {
    router.push(`/service/${id}`)
  }

  return (
    <VStack border="1px" p="4" w="240px" minH="140px" justify="space-between">
      <Text fontWeight="bold">{title}</Text>
      <HStack mt="4">
        <Button onClick={handleEdit}>{isCompleted ? 'Edit' : 'Continue...'}</Button>
        <Button
          isLoading={loadingValue}
          disabled={!isCompleted}
          bg={published ? 'red.200' : 'green.200'}
          onClick={handleToggle}
        >
          {published ? 'Unpublish' : 'Publish'}
        </Button>
      </HStack>
    </VStack>
  )
}
