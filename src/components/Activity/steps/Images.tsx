import { useCallback, useState } from 'react'
import {
  Flex,
  Heading,
  Text,
  VStack,
  Button,
  SimpleGrid,
  Icon,
  Image,
  IconButton,
  Progress,
} from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import { useStateMachine } from 'little-state-machine'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDropzone } from 'react-dropzone'
import updateIm from 'immutability-helper'

import CloudSvg from 'svg/icons/cloud.svg'
import { DragCard } from 'components'
import { getImageKitUrl } from 'lib/utils'
import { auth, storage, uploadTask } from 'lib/firebase'
import { Navigation } from '../Navigation'
import { update } from '../utils'

const NUM_IMG = 10

export function Images() {
  const { state, actions } = useStateMachine({ update }) as any
  const [isUploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 })
  const { images } = state

  const handleDelete = (imgUrl: string) => {
    const imgRef = storage.refFromURL(imgUrl)
    actions.update({ images: images.filter((i: string) => i !== imgUrl) })
    imgRef.delete().catch((error) => {
      console.error(error)
    })
  }

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = images[dragIndex]
      if (!dragCard) return

      const reordered = updateIm(images, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      })
      actions.update({ images: reordered })
    },
    [images]
  )

  const onDrop = async (files: any) => {
    const urls: string[] = []
    setUploading(true)
    setProgress((p) => ({
      ...p,
      total: images.length + files.length > NUM_IMG ? NUM_IMG - images.length : files.length,
    }))

    const heic2any = (await import('heic2any')).default
    // @ts-ignore
    const { readAndCompressImage } = await import('browser-image-resizer')

    for await (const file of files) {
      setProgress((p) => ({ ...p, percent: 0, current: urls.length + 1 }))

      if (images.length + urls.length >= NUM_IMG) break

      const resizedImage = await readAndCompressImage(
        file.type === 'image/heic' ? await heic2any({ blob: file }) : file,
        {
          quality: 0.9,
          maxWidth: 2400,
          maxHeight: 2400,
          debug: true,
          mimeType: 'image/webp',
        }
      )

      const extension = resizedImage.type.replace('image/', '')
      const path = `uploads/${auth.currentUser?.uid}/${Date.now()}.${extension}`

      const onProgres = (percent: number) => setProgress((p) => ({ ...p, percent }))

      const url = (await uploadTask({ path, blob: resizedImage, onProgres })) as string
      urls.push(url)
    }

    actions.update({ images: [...images, ...urls] })
    setUploading(false)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, image/heic, image/webp',
    disabled: isUploading,
  })

  return (
    <>
      <Flex justifyContent="space-between" alignItems="flex-start" p="40px" w="full">
        <Flex direction="column" alignItems="flex-start" w="full">
          <Heading size="md" mb="1rem">
            Add Images
          </Heading>
          <Text color="#616167">We recommend using your own images instead of stock images.</Text>
          <Text fontSize="12px" fontWeight="bold" mt="2rem" mb="1rem">
            Upload images (max {NUM_IMG} images)
          </Text>
          {images.length ? (
            <DndProvider backend={HTML5Backend}>
              <SimpleGrid columns={[1, 1, 2, 3, 4, 5]} spacing="1rem" w="auto">
                {images.map((url: string, i: number) => (
                  // @ts-ignore
                  <DragCard key={url} index={i} id={url} moveCard={moveCard}>
                    <Flex
                      w="172px"
                      h="130px"
                      rounded="1rem"
                      overflow="hidden"
                      bg="white"
                      pos="relative"
                    >
                      <Image src={getImageKitUrl(url, { w: 172, h: 130 })} />
                      <IconButton
                        aria-label="Delete image"
                        isRound
                        icon={<SmallCloseIcon color="#b3b3b3" />}
                        onClick={() => handleDelete(url)}
                        pos="absolute"
                        size="xs"
                        right="2"
                        top="2"
                      />
                      {i === 0 && (
                        <Text
                          pos="absolute"
                          textTransform="uppercase"
                          px="14px"
                          py="6px"
                          bottom="0"
                          bg="af.teal"
                          color="white"
                          fontWeight="bold"
                          fontSize="xs"
                          roundedTopRight="1rem"
                        >
                          Primary
                        </Text>
                      )}
                    </Flex>
                  </DragCard>
                ))}
                {images.length < NUM_IMG && (
                  <DropContainer
                    isUploading={isUploading}
                    progress={progress}
                    {...getRootProps()}
                    w="172px"
                    h="130px"
                    text="Add more images"
                  >
                    <input {...getInputProps()} />
                  </DropContainer>
                )}
              </SimpleGrid>
            </DndProvider>
          ) : (
            <DropContainer
              isUploading={isUploading}
              progress={progress}
              {...getRootProps()}
              text="Drag and drop your images here, or"
            >
              <input {...getInputProps()} />
              <Button bg="af.teal" color="white">
                Browse files
              </Button>
            </DropContainer>
          )}
        </Flex>
      </Flex>
      <Navigation isValid={!!state.images.length} />
    </>
  )
}

const DropContainer = ({ children, text, progress, isUploading, ...rest }: any) => (
  <VStack
    bg="white"
    w="full"
    rounded="1rem"
    p="2rem"
    spacing="3"
    overflow="hidden"
    shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
    outline="none"
    pos="relative"
    {...rest}
  >
    {isUploading ? (
      <>
        <Progress
          w="full"
          bg="white"
          overflow="visible"
          size="xs"
          colorScheme="gray"
          pos="absolute"
          bottom="0px"
          value={progress.percent}
        />
        <Icon as={CloudSvg} w="32px" h="32px" />
        <Text fontSize="xs" color="#616167" textAlign="center">
          Uploading {progress.current} / {progress.total}
        </Text>
      </>
    ) : (
      <>
        <Icon as={CloudSvg} w="32px" h="32px" />
        <Text fontSize="xs" color="#616167">
          {text}
        </Text>
        {children}
      </>
    )}
  </VStack>
)
