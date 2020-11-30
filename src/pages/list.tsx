import { useState } from 'react'
import { Text, Box, VStack, HStack, Button, Skeleton } from '@chakra-ui/core'
import { useRouter } from 'next/router'

import { Meta } from 'components'
import { useServices } from 'hooks/services'

export default function ListServices() {
  const { data, loading, toggleService } = useServices()

  return (
    <>
      <Meta title="List services" />
      <Text>List services</Text>
      <VStack mt="8" w="md" alignItems="flex-start">
        <Skeleton isLoaded={!loading || data}>
          <HStack spacing="4">
            {data?.map((serviceData: any) => (
              <Service key={serviceData.id} {...serviceData} toggleService={toggleService} />
            ))}
          </HStack>
        </Skeleton>
      </VStack>
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
    <Box border="1px" p="4" minW="16">
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
    </Box>
  )
}
