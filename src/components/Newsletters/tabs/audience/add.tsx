import { useState } from 'react'
import Link from 'next/link'
import { VStack, Input, Text, HStack, Button, Link as ChakraLink } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { firestore } from 'lib/firebase'
import { Card } from 'components/UI'
import { useUserData, useAudience } from 'hooks'
import { giveConsent } from 'api'
import { showAlert } from 'lib/utils'

export const Add = () => {
  const [loading, setLoading] = useState(false)
  const { user } = useUserData()
  const isDisabled = !user.hasConsent
  const [audience = []] = useAudience()

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

const ConsentBox = () => {
  const [loading, setLoading] = useState(false)
  const { user } = useUserData()

  const handleConsent = async () => {
    setLoading(true)
    await giveConsent()
    setLoading(false)
  }

  if (user.hasConsent) return null

  return (
    <Card variant="white">
      <HStack spacing="1rem">
        <Text>
          Before start importing my audience into Artsflow platform, I consnt I have perimission
          from the recipients to send them emails. See our{` `}
          <Link as="/terms" href="/terms" passHref>
            <ChakraLink isExternal textDecor="underline" color="af.pink">
              Terms of Service
            </ChakraLink>
          </Link>
          {` `} for more information.
        </Text>
        <Button isLoading={loading} onClick={handleConsent} variant="important">
          I consent
        </Button>
      </HStack>
    </Card>
  )
}
