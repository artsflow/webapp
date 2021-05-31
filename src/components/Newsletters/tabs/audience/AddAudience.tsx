import { useState } from 'react'
import { VStack, Input, HStack, Button } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { firestore } from 'lib/firebase'
import { useUserData, useAudience } from 'hooks'
import { showAlert } from 'lib/utils'
import { ConsentBox } from './ConsentBox'

export const AddAudience = () => {
  const [loading, setLoading] = useState(false)
  const { user } = useUserData()
  const isDisabled = !user.hasConsent
  const [audience] = useAudience()

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {},
    mode: 'onBlur',
  })

  const handleAdd = async (data: any) => {
    if (audience.find((a: any) => a.email === data.email)) {
      showAlert({
        title: 'Email address already on the list',
        status: 'warning',
      })
      return
    }
    setLoading(true)
    try {
      await firestore
        .collection('audience')
        .add({ ...data, userId: user.id, createdAt: new Date() })
      reset()
      showAlert({
        title: 'Persson added to audience list',
        status: 'success',
      })
    } catch (e) {
      showAlert({
        title: 'Error!',
        description: e.message,
        status: 'error',
      })
    }
    setLoading(false)
  }

  const handleCSVImport = async () => {
    showAlert({
      title: 'CSV import not implemented',
      status: 'warning',
    })
  }

  return (
    <VStack maxW="800px" spacing="1rem" alignItems="flex-start">
      <ConsentBox />
      <form onSubmit={handleSubmit(handleAdd)}>
        <HStack spacing="1rem" w="full">
          <Input
            w="full"
            placeholder="Enter name..."
            name="name"
            type="text"
            ref={register({
              required: true,
            })}
          />
          <Input
            w="full"
            placeholder="Enter email..."
            name="email"
            type="email"
            ref={register({
              required: true,
            })}
          />
          <Button variant="primary" disabled={isDisabled} type="submit" isLoading={loading}>
            Add
          </Button>
          <Button
            variant="secondary"
            w="full"
            minW="220px"
            disabled={isDisabled}
            onClick={handleCSVImport}
          >
            Add multiple (CSV import)
          </Button>
        </HStack>
      </form>
    </VStack>
  )
}
