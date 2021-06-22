import { useContext, useState, useCallback } from 'react'
import {
  Text,
  Heading,
  Button,
  Box,
  HStack,
  IconButton,
  Avatar,
  Input,
  Textarea,
  VStack,
  InputGroup,
  InputRightElement,
  CircularProgress,
  Icon,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { BsEye, BsLock } from 'react-icons/bs'
import { useDropzone } from 'react-dropzone'

import { UserContext } from 'lib/context'
import { getImageKitUrl, showAlert } from 'lib/utils'
import { auth, storage, STATE_CHANGED } from 'lib/firebase'
import { updateProfile, updateAvatarUrl } from 'api'
import CameraSvg from 'svg/icons/camera.svg'
import { Meta } from 'components'
import { trackUpdateAvatar, trackUpdateProfile } from 'analytics'

type Inputs = {
  firstName: string
  lastName: string
  bio: string
}

const DESCRIPTION_MAX_LENGTH = 1000

export default function Profile(): JSX.Element {
  const [isLoading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isCompressing, setCompressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { user, profile } = useContext(UserContext)
  const { register, handleSubmit, formState, reset, watch } = useForm<Inputs>()

  const { firstName, lastName, displayName, bio, photoURL } = profile
  const { isDirty, errors } = formState

  const bioLength = watch('bio', '')?.length || bio?.length

  const onDrop = useCallback(async ([file]) => {
    setCompressing(true)

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
        mimeType: 'image/webp',
      }
    )

    setCompressing(false)
    const extension = resizedImage.type.replace('image/', '')

    const ref = storage.ref(`uploads/${auth.currentUser?.uid}/${Date.now()}.${extension}`)
    setUploading(true)
    const task = ref.put(resizedImage)

    task.on(STATE_CHANGED, (snapshot) => {
      const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
      setProgress(parseInt(pct, 10))
    })

    task
      .then(() => ref.getDownloadURL())
      .then(async (url) => {
        setUploading(false)
        await updateAvatarUrl(url)
        trackUpdateAvatar()
      })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, image/heic, image/webp',
  })

  const onSubmit = async (data: Inputs) => {
    setLoading(true)
    const result = await updateProfile(data)

    setLoading(false)
    reset()
    if (result) {
      showAlert({ title: 'Information updated', status: 'success' })
      trackUpdateProfile(user.id, {
        ...data,
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
      })
    } else {
      showAlert({ title: 'Information not updated', status: 'error' })
    }
  }

  return (
    <>
      <Meta title="My Profile" />
      <Box w="100%" p="40px">
        <Heading fontSize="lg" mb="1rem">
          My profile
        </Heading>
        <Text color="#616167">Edit and add to your profile here.</Text>

        <Box bg="white" shadow="sm" px="1.5rem" py="2rem" mt="80px" rounded="12px">
          <Box mt="-75px" mb="75px" pb="2rem" pos="relative" w="90px">
            <Avatar
              name={displayName}
              width="90px"
              height="90px"
              src={getImageKitUrl(photoURL, { w: 90, h: 90, tr: 'fo-face' })}
              bg="af.pink"
              color="white"
              pos="absolute"
              left="0"
              top="0"
            />
            <CircularProgress
              min={0}
              max={100}
              value={progress}
              size="114px"
              left="-12px"
              top="-12px"
              thickness="4px"
              color="af.teal"
              trackColor="white"
              pos="absolute"
              isIndeterminate={isCompressing}
              display={uploading ? 'block' : 'none'}
            />
            <input {...getInputProps()} />
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
              {...getRootProps()}
            />
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HStack spacing="1.5rem" alignItems="flex-start">
              <VStack alignItems="flex-start" w="full">
                <Text fontWeight="bold">First name</Text>
                <InputGroup>
                  <Input
                    variant="outline"
                    placeholder="First name"
                    defaultValue={firstName}
                    {...register('firstName', {
                      required: true,
                      maxLength: 20,
                      pattern: /^[A-Za-z\- ]+$/i,
                    })}
                  />
                  <InputRightElement children={<Icon as={BsEye} color="gray.300" />} />
                </InputGroup>
                <Error
                  errors={errors}
                  name="firstName"
                  message="First name max length is 20 characters"
                />
              </VStack>
              <VStack alignItems="flex-start" w="full">
                <Text fontWeight="bold">Last name</Text>
                <InputGroup>
                  <Input
                    variant="outline"
                    placeholder="Last name"
                    defaultValue={lastName}
                    {...register('lastName', {
                      required: true,
                      maxLength: 40,
                      pattern: /^[A-Za-z\- ]+$/i,
                    })}
                  />
                  <InputRightElement children={<Icon as={BsEye} color="gray.300" />} />
                </InputGroup>
                <Error
                  errors={errors}
                  name="lastName"
                  message="First name max length is 40 characters"
                />
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
            <VStack alignItems="flex-start" w="calc(66.66% - 0.5rem)" mt="1.5rem">
              <HStack justifyContent="space-between" w="full">
                <Text fontWeight="bold">Short description</Text>
                <Text fontSize="xs" color="gray.400">
                  {bioLength} / {DESCRIPTION_MAX_LENGTH}
                </Text>
              </HStack>
              <InputGroup>
                <Textarea
                  placeholder="a little about you"
                  defaultValue={bio}
                  rows={8}
                  {...register('bio', { maxLength: DESCRIPTION_MAX_LENGTH })}
                />
                <InputRightElement children={<Icon as={BsEye} color="gray.300" />} />
              </InputGroup>
              <Error
                errors={errors}
                name="bio"
                message={`Short description max length is ${DESCRIPTION_MAX_LENGTH} characters`}
              />
            </VStack>
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
              disabled={!isDirty || isLoading}
            >
              Update details
            </Button>
          </form>
        </Box>
      </Box>
    </>
  )
}

const Error = (props: any) => (
  <ErrorMessage as={<Text color="red.400" fontSize="xs" />} {...props} />
)
