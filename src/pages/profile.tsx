import { useContext, useState } from 'react'
import {
  Text,
  Heading,
  Button,
  Box,
  HStack,
  IconButton,
  Avatar,
  Input,
  VStack,
  useToast,
  InputGroup,
  InputRightElement,
  Icon,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

import { BsEye, BsLock } from 'react-icons/bs'

import { UserContext } from 'lib/context'

import CameraSvg from 'svg/icons/camera.svg'
import { updateProfile } from 'api'

type Inputs = {
  firstName: string
  lastName: string
  address: string
  bio: string
}

export default function Profile(): JSX.Element {
  const [isLoading, setLoading] = useState(false)
  const { user, profile } = useContext(UserContext)
  const { register, handleSubmit, formState, reset } = useForm<Inputs>()
  const toast = useToast()

  const { firstName, lastName, displayName, bio, photoURL } = profile
  const { isDirty } = formState

  const onSubmit = async (data: Inputs) => {
    reset()
    setLoading(true)
    const result = await updateProfile(data)
    setLoading(false)
    if (result) {
      toast({
        title: 'Information updated',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top',
      })
    } else {
      toast({
        title: 'Information not updated',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top',
      })
    }
  }

  return (
    <Box w="100%">
      <Heading size="md" mb="1rem">
        My profile
      </Heading>
      <Text color="#616167">Edit and add to your profile here.</Text>

      <Box bg="white" shadow="sm" px="1.5rem" py="2rem" mt="80px" rounded="12px">
        <Box mt="-75px" pb="2rem" pos="relative" w="90px">
          <Avatar name={displayName} width="90px" height="90px" src={photoURL} />
          <IconButton
            variant="ghost"
            border="2px solid #F9F9F9"
            bg="#47BCC8"
            colorScheme="ghost"
            aria-label="Upload avatar picture"
            isRound
            pos="absolute"
            right="-10px"
            top="45px"
            icon={<CameraSvg width="20px" height="20px" />}
            // onClick={onClick}
          />
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <HStack spacing="1.5rem">
            <VStack alignItems="flex-start" w="full">
              <Text fontWeight="bold">First name</Text>
              <InputGroup>
                <Input
                  placeholder="First name"
                  defaultValue={firstName}
                  name="firstName"
                  ref={register({ required: true, maxLength: 20, pattern: /^[A-Za-z]+$/i })}
                />
                <InputRightElement children={<Icon as={BsEye} color="gray.300" />} />
              </InputGroup>
            </VStack>
            <VStack alignItems="flex-start" w="full">
              <Text fontWeight="bold">Last name</Text>
              <InputGroup>
                <Input
                  placeholder="Last name"
                  defaultValue={lastName}
                  name="lastName"
                  ref={register({ required: true, maxLength: 40, pattern: /^[A-Za-z]+$/i })}
                />
                <InputRightElement children={<Icon as={BsEye} color="gray.300" />} />
              </InputGroup>
            </VStack>
            <VStack alignItems="flex-start" w="full">
              <Text fontWeight="bold">Email</Text>
              <InputGroup>
                <Input
                  placeholder="Email"
                  readOnly
                  disabled
                  bg="#FAFAFA"
                  defaultValue={user.email}
                />
                <InputRightElement children={<Icon as={BsLock} color="gray.300" />} />
              </InputGroup>
            </VStack>
          </HStack>
          <HStack spacing="1.5rem" mt="1rem">
            <VStack alignItems="flex-start" w="calc(33.33% - 1rem)">
              <Text fontWeight="bold">Address</Text>
              <InputGroup>
                <Input
                  placeholder="Enter your address"
                  defaultValue={user.address}
                  name="address"
                  ref={register({ maxLength: 120 })}
                />
                <InputRightElement children={<Icon as={BsLock} color="gray.300" />} />
              </InputGroup>
            </VStack>
            <VStack alignItems="flex-start" w="calc(66.66% - 1rem)">
              <Text fontWeight="bold">Short description</Text>
              <InputGroup>
                <Input
                  placeholder="a little about you"
                  defaultValue={bio}
                  name="bio"
                  ref={register({ maxLength: 420 })}
                />
                <InputRightElement children={<Icon as={BsEye} color="gray.300" />} />
              </InputGroup>
            </VStack>
          </HStack>
          <VStack py="1.5rem" mb="1.5rem" alignItems="flex-start" color="gray.400">
            <Text fontSize="xs">
              <Icon as={BsEye} mr="0.7rem" />
              public information on my profile
            </Text>
            <Text fontSize="xs">
              <Icon as={BsLock} mr="0.7rem" />
              data is private
            </Text>
          </VStack>
          <Button
            type="submit"
            bg="#47BCC8"
            color="white"
            isLoading={isLoading}
            disabled={!isDirty}
          >
            Update details
          </Button>
        </form>
      </Box>
    </Box>
  )
}
