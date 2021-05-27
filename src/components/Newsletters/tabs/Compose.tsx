import { useState } from 'react'
import { Text, VStack, Input, Button } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { Editor } from 'components'

export const Compose = () => {
  const [editorState, setEditorState] = useState('')
  const { register, handleSubmit } = useForm({})

  const onSubmit = async (data: any) => {
    console.log(data, editorState)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack alignItems="flex-start" spacing="1.5rem" pt="1.5rem">
        <VStack alignItems="flex-start" spacing="0.5rem">
          <Text fontSize="sm" fontWeight="semibold">
            Subject
          </Text>
          <Input
            bg="white"
            border="1px solid white"
            shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
            rounded="6px"
            w="360px"
            placeholder="Enter subject..."
            ref={register({
              required: true,
              maxLength: 100,
            })}
            name="subject"
          />
        </VStack>
        <Editor onChange={setEditorState} />
        <Button type="submit">Send</Button>
      </VStack>
    </form>
  )
}
