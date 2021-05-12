import { useRef, useState } from 'react'
import {
  Image,
  Tag,
  Flex,
  Text,
  Heading,
  HStack,
  VStack,
  Icon,
  Tooltip,
  Link,
  Skeleton,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from '@chakra-ui/react'
import { format, addMinutes } from 'date-fns'
import { BsLink, BsThreeDots } from 'react-icons/bs'
import { capitalize, sortBy } from 'lodash'
import { useRouter } from 'next/router'

import { getImageKitUrl } from 'lib/utils'
import { ARTSFLOW_URL } from 'lib/config'
import { setActivityStatus, deleteActivity } from 'api'
import CalendarRepeatIcon from 'svg/icons/calendar-repeat.svg'

export const ActivityCard = (props: any) => {
  const {
    title,
    category,
    images,
    duration,
    dates,
    monetizationType,
    price,
    id,
    loading,
    status,
  } = props

  if (loading) return <Skeleton rounded="12px" width="360px" height="200px" />

  const [nextSession] = sortBy(dates, [(d: string) => new Date(d)])
    .map((d: string) => new Date(d))
    .filter((d) => d > new Date())

  const from = format(nextSession, 'HH:mm')
  const to = format(addMinutes(nextSession, duration), 'HH:mm')

  const isPaid = monetizationType === 'Paid'

  const freqLabel = dates
    .map((d: string) => format(new Date(d), 'dd MMM, yyy - HH:mm'))
    .map((d: string) => <Text key={d}>{d}</Text>)

  const isActive = status === 'active'

  const activityLink = `${ARTSFLOW_URL}/a/${id}`

  return (
    <VStack
      rounded="12px"
      bg="white"
      w="360px"
      minH="200px"
      p="1.5rem"
      spacing="1.5rem"
      shadow="0px 3px 8px -1px rgba(50, 50, 71, 0.05)"
    >
      <HStack spacing="1rem" w="full" pos="relative">
        <Image
          width="48px"
          height="48px"
          rounded="12px"
          src={getImageKitUrl(images[0], { w: 48, h: 48 })}
          bg="af.pink"
        />
        <Heading as="h2" fontSize="1rem" fontWeight="semibold">
          {title}
        </Heading>
        <OptionsMenu id={id} isActive={isActive} />
      </HStack>
      <HStack justifyContent="flex-start" w="full" spacing="1.5rem">
        <VStack alignItems="flex-start">
          <Text fontSize="xs" color="#616167">
            Next session
          </Text>
          <Text fontSize="xs" fontWeight="bold">
            {format(nextSession, 'MMM dd, yyyy')}
          </Text>
        </VStack>
        <Flex w="1px" bg="#F3F3F3" h="70%" />
        <VStack alignItems="flex-start">
          <Text fontSize="xs" color="#010102">
            Time interval
          </Text>
          <Text fontSize="xs" fontWeight="bold">
            {from} - {to}
          </Text>
        </VStack>
      </HStack>
      <HStack justifyContent="space-between" w="full" alignItems="flex-end">
        <HStack spacing="1rem" alignItems="flex-end">
          <Text fontSize="xs" color="#616167" pb="2px">
            {category}
          </Text>
          <Separator />
          <Text fontSize="xs" color={isPaid ? '#616167' : 'af.pink'} pb="2px">
            {isPaid ? `£${price}` : monetizationType}
          </Text>
          <Separator />
          <Tooltip label={freqLabel} placement="top" closeOnClick hasArrow shouldWrapChildren>
            <Icon as={CalendarRepeatIcon} color="#616167" />
          </Tooltip>
          <Separator />
          <Tooltip
            label={`Your activity link (click to open): \n${activityLink}`}
            placement="top"
            closeOnClick
            hasArrow
            shouldWrapChildren
          >
            <Link href={activityLink} isExternal>
              <Icon as={BsLink} h="16px" w="16px" />
            </Link>
          </Tooltip>
        </HStack>
        <Tag
          color={isActive ? 'af.teal' : 'white'}
          fontSize="xs"
          bg={isActive ? '#edf8fa' : '#d2d2d4'}
          px="10px"
          py="8px"
          rounded="100px"
        >
          {capitalize(status)}
        </Tag>
      </HStack>
    </VStack>
  )
}

const Separator = () => <Flex w="1px" bg="#F3F3F3" h="10px" mb="4px" />

const optionMessage = {
  pause: {
    header: 'Pause activity?',
    body: 'Are you sure you want to pause this activity?',
  },
  active: {
    header: 'Set active?',
    body: 'Are you sure you want to set this activity as active?',
  },
  delete: {
    header: 'Delete activity?',
    body: 'Are you sure you want to delete this activity?',
  },
} as any

const OptionsMenu = (props: any) => {
  const { id, isActive } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [action, setAction] = useState(isActive ? 'pause' : 'active')
  const [isLoading, setLoading] = useState(false)
  const cancelRef = useRef() as any
  const router = useRouter()

  const { header, body } = optionMessage[action]

  const menuItem = isActive ? 'Pause' : 'Set active'

  const toggleStateAlert = () => {
    setAction(isActive ? 'pause' : 'active')
    onOpen()
  }

  const handleDeleteAlert = () => {
    setAction('delete')
    onOpen()
  }

  const handleAction = async () => {
    switch (action) {
      case 'delete':
        setLoading(true)
        await deleteActivity({ id })
        break

      default:
        setLoading(true)
        await setActivityStatus({ status: isActive ? 'paused' : 'active', id })
        break
    }
    onClose()
    setLoading(false)
  }

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          variant="unstyled"
          display="flex"
          flexDirection="row"
          isRound
          icon={<BsThreeDots />}
          pos="absolute"
          right="-15px"
          top="-15px"
          color="#8e8e92"
        />
        <MenuList ml="-190px">
          <MenuItem onClick={() => router.push(`/activities/edit/${id}`)}>Edit</MenuItem>
          <MenuItem onClick={toggleStateAlert}>{menuItem}</MenuItem>
          <MenuDivider />
          <MenuItem onClick={handleDeleteAlert} color="red.500">
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>{header}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{body}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" ml={3} onClick={handleAction} isLoading={isLoading}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
