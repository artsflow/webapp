import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { RiImageAddFill } from 'react-icons/ri'
import {
  Box,
  Text,
  Icon,
  CircularProgress,
  CircularProgressLabel,
  Image,
  IconButton,
  VStack,
} from '@chakra-ui/core'
import { DeleteIcon } from '@chakra-ui/icons'
import { gql } from 'graphql-request'

import { client, clientWithProgressUpload } from 'services/client'

const UPLOAD_IMAGE = gql`
  mutation uploadImage($file: Upload!) {
    uploadImage(file: $file)
  }
`

const DELETE_IMAGE = gql`
  mutation deleteImage($id: String!) {
    deleteImage(id: $id)
  }
`

interface ImageUploaderProps {
  onUpload: (f: string) => void
  onDelete: (f: string) => void
  imageId: string
}

export function ImageUploader({ onUpload, onDelete, imageId }: ImageUploaderProps) {
  const [fileName, setFileName] = useState(imageId)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDelete = useCallback(async () => {
    setFileName('')
    await client.request(DELETE_IMAGE, { id: fileName })
    onDelete(fileName)
  }, [fileName])

  const onProgress = (ev: ProgressEvent) => {
    setProgress(ev.loaded / ev.total)
  }

  const onDrop = useCallback(async ([file]) => {
    setIsLoading(true)

    const heic2any = (await import('heic2any')).default
    // @ts-ignore
    const { readAndCompressImage } = await import('browser-image-resizer')

    const resizedImage = await readAndCompressImage(
      file.type === 'image/heic' ? await heic2any({ blob: file }) : file,
      {
        quality: 0.9,
        maxWidth: 2400,
        maxHeight: 2400,
        debug: true,
      }
    )

    const progressUploadClient = clientWithProgressUpload(onProgress)
    const { uploadImage } = await progressUploadClient.request(UPLOAD_IMAGE, { file: resizedImage })

    setIsLoading(false)
    setFileName(uploadImage)
    onUpload(uploadImage)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, image/heic',
  })

  return (
    <>
      {fileName ? (
        <Box pos="relative">
          <Image
            boxSize="160px"
            src={`https://ik.imagekit.io/artsflow/tr:w-160,h-160,fo-auto/${fileName}`}
          />
          <IconButton
            top="3"
            right="0"
            pos="absolute"
            variant="link"
            colorScheme="red"
            aria-label="Delete"
            icon={<DeleteIcon />}
            onClick={handleDelete}
          />
        </Box>
      ) : (
        <Box {...getRootProps()} outline="none" cursor="pointer">
          {!isLoading ? (
            <>
              <input {...getInputProps()} />
              <Icon w="160px" h="160px" as={RiImageAddFill} color="grey" />
            </>
          ) : (
            <VStack>
              <CircularProgress
                min={0}
                max={1}
                value={progress}
                isIndeterminate={progress === 1}
                color="blue.400"
              >
                {progress !== 1 && (
                  <CircularProgressLabel fontSize="xs">{`${Math.round(
                    progress * 100
                  )}%`}</CircularProgressLabel>
                )}
              </CircularProgress>
              <Text fontSize="xs">{progress === 1 ? `processing...` : 'uploading...'}</Text>
            </VStack>
          )}
        </Box>
      )}
    </>
  )
}
