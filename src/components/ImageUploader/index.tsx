import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { RiImageAddFill } from 'react-icons/ri'
import { Box, Icon, Spinner, Image, IconButton } from '@chakra-ui/core'
import { DeleteIcon } from '@chakra-ui/icons'
import { gql } from 'graphql-request'

import { client } from 'services/client'

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

export function ImageUploader() {
  const [fileName, setFileName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = useCallback(async () => {
    console.log('remove', fileName)
    setFileName('')
    await client.request(DELETE_IMAGE, { id: fileName })
  }, [fileName])

  const onDrop = useCallback(async ([file]) => {
    setIsLoading(true)
    const res = await client.request(UPLOAD_IMAGE, { file })
    setIsLoading(false)
    setFileName(res?.uploadImage)
    console.log(res)
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
            boxSize="100px"
            src={`https://ik.imagekit.io/artsflow/${fileName}?tr=h-100,w-100`}
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
              <Icon w="100px" h="100px" as={RiImageAddFill} color="grey" />
            </>
          ) : (
            <Spinner size="xl" />
          )}
        </Box>
      )}
    </>
  )
}
