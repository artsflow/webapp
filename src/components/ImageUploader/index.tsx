import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { RiImageAddFill } from 'react-icons/ri'
import { Icon } from '@chakra-ui/core'
import { gql } from 'graphql-request'

import { client } from 'services/client'

const UPLOAD_IMAGE = gql`
  mutation uploadImage($file: Upload!) {
    uploadImage(file: $file)
  }
`

export function ImageUploader() {
  const onDrop = useCallback(async ([file]) => {
    console.log(file)
    const res = await client.request(UPLOAD_IMAGE, { file })
    console.log(res)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, image/heic',
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Icon w="100px" h="100px" as={RiImageAddFill} color="grey" />
    </div>
  )
}
