import { gql } from 'graphql-request'
import { useForm } from 'react-hook-form'
import {
  Box,
  Heading,
  Button,
  Input,
  Textarea,
  VStack,
  FormErrorMessage,
  FormLabel,
  FormControl,
} from '@chakra-ui/core'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'

import { Meta, ImageUploader, AddressLookup } from 'components'
import { client } from 'services/client'

const ADD_SERVICE = gql`
  mutation addService($input: ServiceInput!) {
    addService(input: $input)
  }
`

export default function AddService() {
  const { register, handleSubmit, errors, formState, setValue } = useForm()
  const router = useRouter()

  const onSubmit = async (data: any) => {
    if (isEmpty(data)) return
    const variables = { input: { ...data, address: JSON.parse(data.address), published: false } }
    const res = await client.request(ADD_SERVICE, variables)
    console.log(res)
    router.push('/list')
  }

  return (
    <>
      <Meta title="Add service" />
      <Heading size="md">Add service</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name}>
          <VStack mt="8" w="md" alignItems="flex-start" spacing="4">
            <ImageUploader />
            <Box w="full">
              <FormLabel htmlFor="title">Title</FormLabel>
              <Input
                name="title"
                placeholder="Add title"
                size="md"
                ref={register({ required: true, maxLength: 80 })}
              />
            </Box>
            <Box w="full">
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                name="description"
                placeholder="Add description"
                size="md"
                ref={register({ required: true, maxLength: 200 })}
              />
            </Box>
            <Input type="hidden" name="address" ref={register({ required: true })} />
            <AddressLookup
              onAddress={(address: any) => setValue('address', JSON.stringify(address))}
            />
            <Button type="submit" isLoading={formState.isSubmitting}>
              Submit
            </Button>
          </VStack>
          <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
        </FormControl>
      </form>
    </>
  )
}
