import { useState } from 'react'
import { Text, Box, VStack, HStack, Button, Skeleton } from '@chakra-ui/core'

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
              <Service key={data.id} {...serviceData} toggleService={toggleService} />
            ))}
          </HStack>
        </Skeleton>
      </VStack>
    </>
  )
}

const Service = ({ id, title, description, published, toggleService }: any) => {
  const [loadingValue, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    await toggleService(id)
    setLoading(false)
  }

  return (
    <Box border="1px" p="4" minW="16">
      <Text fontWeight="bold">{title}</Text>
      <Text>{description}</Text>
      <HStack mt="4">
        <Button>Edit</Button>
        <Button
          isLoading={loadingValue}
          bg={published ? 'red.200' : 'green.200'}
          onClick={handleToggle}
        >
          {published ? 'Unpublish' : 'Publish'}
        </Button>
      </HStack>
    </Box>
  )
}
