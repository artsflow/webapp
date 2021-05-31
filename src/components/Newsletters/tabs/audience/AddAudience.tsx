import { useState } from 'react'
import { VStack, Input, HStack, Button, useDisclosure } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { firestore } from 'lib/firebase'
import { useUserData, useAudience } from 'hooks'
import { showAlert } from 'lib/utils'
import { ConsentBox } from './ConsentBox'
import { CSVImport, AUDIENCE_LIMIT } from './CSVImport'

export const AddAudience = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = useState(false)
  const { user } = useUserData()
  const isDisabled = !user.hasConsent
  const [audience] = useAudience()

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {},
    mode: 'onBlur',
  })

  const handleAdd = async (data: any) => {
    const contactsLeft = AUDIENCE_LIMIT - audience.length

    if (contactsLeft <= 0) {
      showAlert({
        title: 'Error!',
        description: `You reached the audience limit of ${AUDIENCE_LIMIT} contacts`,
        status: 'error',
      })
      return
    }

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
        title: `${data.email} added to audience list`,
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
          <Button variant="secondary" w="full" minW="220px" disabled={isDisabled} onClick={onOpen}>
            Add multiple (CSV import)
          </Button>
        </HStack>
      </form>
      <CSVImport isOpen={isOpen} onClose={onClose} />
    </VStack>
  )
}
