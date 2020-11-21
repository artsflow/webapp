import { gql } from 'graphql-request'
import { useForm } from 'react-hook-form'
import {
  Text,
  Button,
  Input,
  Textarea,
  VStack,
  FormErrorMessage,
  FormLabel,
  FormControl,
} from '@chakra-ui/core'

import { Meta } from 'components'
import { client } from 'services/client'

const ADD_SERVICE = gql`
  mutation addService($serviceInput: ServiceInput!) {
    addService(serviceInput: $serviceInput)
  }
`

export default function AddService() {
  const { register, handleSubmit, errors, formState } = useForm()
  const onSubmit = async (data: any) => {
    console.log(data)
    const variables = { serviceInput: { ...data, published: false } }
    const res = await client.request(ADD_SERVICE, variables)
    console.log(res)
  }

  return (
    <>
      <Meta title="Add service" />
      <Text>Add service</Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name}>
          <VStack mt="8" w="md" alignItems="flex-start">
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              name="title"
              placeholder="Add title"
              size="md"
              ref={register({ required: true, maxLength: 80 })}
            />
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              name="description"
              placeholder="Add description"
              size="md"
              ref={register({ required: true, maxLength: 200 })}
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
