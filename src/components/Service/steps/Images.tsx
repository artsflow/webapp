import { useContext } from 'react'
import { Box, SimpleGrid, Heading } from '@chakra-ui/core'

import { ImageUploader } from 'components'
import { Context } from '../machine'

const NUM_IMG = 6

export function Images() {
  const { send, context } = useContext(Context) as any
  const { images } = context

  const handleUpload = (imageId: string) => {
    send({ type: 'UPDATE', action: 'addImage', data: { imageId, meta: { isDirty: true } } })
    send('SAVE')
    send({ type: 'UPDATE', data: { meta: { isDirty: false } } })
  }

  const handleDelete = (imageId: string) => {
    send({ type: 'UPDATE', action: 'removeImage', data: { imageId, meta: { isDirty: true } } })
    send('SAVE')
    send({ type: 'UPDATE', data: { meta: { isDirty: false } } })
  }

  return (
    <Box>
      <Heading mb="4" size="lg">
        Add Images
      </Heading>
      <SimpleGrid columns={3} spacing={4}>
        {[...Array(NUM_IMG).keys()].map((i) => (
          <ImageUploader
            key={i}
            onUpload={handleUpload}
            onDelete={handleDelete}
            imageId={images[i]}
            withProgress={false}
          />
        ))}
      </SimpleGrid>
    </Box>
  )
}
