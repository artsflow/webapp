import { useContext, useCallback } from 'react'
import { Box, SimpleGrid, Heading, Icon } from '@chakra-ui/core'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { RiImageLine } from 'react-icons/ri'
import update from 'immutability-helper'

import { ImageUploader, DragCard } from 'components'
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

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = images[dragIndex]
      if (!dragCard) return

      const reordered = update(images, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      })

      send({ type: 'UPDATE', data: { images: reordered, meta: { isDirty: true } } })
    },
    [images]
  )

  return (
    <Box>
      <Heading mb="4" size="lg">
        Add Images
      </Heading>
      <SimpleGrid columns={3} spacing={4}>
        <DndProvider backend={HTML5Backend}>
          {[...Array(NUM_IMG).keys()].map((i) => {
            if (i > images.length)
              return <Icon w="160px" h="160px" as={RiImageLine} color="grey" border="1px" />
            return (
              <DragCard key={images[i]} index={i} id={images[i]} moveCard={moveCard}>
                <ImageUploader
                  key={i}
                  onUpload={handleUpload}
                  onDelete={handleDelete}
                  imageId={images[i]}
                />
              </DragCard>
            )
          })}
        </DndProvider>
      </SimpleGrid>
    </Box>
  )
}
