import { useContext, useState } from 'react'
import { Box, Text, Heading, Button } from '@chakra-ui/core'

import { Context } from '../machine'

export function Complete() {
  const { context, send } = useContext(Context) as any
  const [loadingValue, setLoading] = useState(false)
  const { published } = context

  const handlePublish = async () => {
    setLoading(true)
    await send({
      type: 'UPDATE',
      data: { published: true, step: 'complete', meta: { isDirty: true } },
    })
    await send('SAVE')
    setLoading(false)
  }

  return (
    <Box w="full">
      <Heading mb="4" size="lg">
        Your service is now complete
      </Heading>
      <Text>Publish the service</Text>
      <Button mt="4" isLoading={loadingValue} onClick={handlePublish} disabled={published}>
        {published ? 'Published' : 'Publish'}
      </Button>
    </Box>
  )
}
