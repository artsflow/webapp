import { useContext } from 'react'
import {
  Grid,
  Box,
  Link,
  Button,
  Text,
  Avatar,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  HStack,
  IconButton,
  Icon,
  useDisclosure,
  Badge,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'

import Logo from 'svg/artsflow.svg'
import BellIcon from 'svg/icons/bell.svg'
import ChatIcon from 'svg/icons/chat.svg'

import { auth } from 'lib/firebase'
import { useRouter } from 'next/router'
import { UserContext } from 'lib/context'
import { Notifications } from 'components'

import { version } from '../../package.json'

export function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = useContext(UserContext)
  const router = useRouter()

  const handleLogout = () => {
    auth.signOut()
    router.push('/')
  }

  return (
    <Grid
      as="nav"
      py="4"
      px="2rem"
      gridTemplateColumns="auto auto 1fr auto auto"
      alignItems="center"
      boxShadow="0px 3px 8px -1px rgba(50, 50, 71, 0.05)"
      zIndex="1"
    >
      <Box>
        <NextLink href="/">
          <Link>
            <Logo width="107px" height="24px" />
          </Link>
        </NextLink>
      </Box>
      <HStack mt="10px" pl="1rem">
        <Text fontSize="10px" color="gray.500">
          v{version} alpha
        </Text>
      </HStack>
      <HStack ml="auto" spacing="1rem" borderRight="1px solid #ECEDF1" mr="1.5rem" pr="1.5rem">
        <RoundButton icon={<Icon as={ChatIcon} />} onClick={() => router.push('/chat')} />
        <RoundButton icon={<Icon as={BellIcon} />} onClick={onOpen} />
      </HStack>
      <VStack mr="4" spacing="0" alignItems="flex-end">
        <Text fontSize="14px" fontWeight="bold">
          {user.displayName}
        </Text>
        <Text fontSize="12px" color="#8e8e93">
          Practitioner
        </Text>
      </VStack>
      <Menu>
        <MenuButton
          as={Button}
          variant="unstyled"
          display="flex"
          flexDirection="row"
          rightIcon={<ChevronDownIcon color="#8e8e93" />}
        >
          <Avatar name={user.displayName} width="36px" height="36px" src={user.photoURL} />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => router.push('/profile')}>My Profile</MenuItem>
          <MenuDivider />
          <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </MenuList>
      </Menu>
      <Notifications onClose={onClose} isOpen={isOpen} />
    </Grid>
  )
}

const RoundButton = ({ icon, onClick }: any) => (
  <Box position="relative">
    <Badge
      ml="1"
      fontSize="10px"
      bg="af.pink"
      zIndex="1"
      color="white"
      pos="absolute"
      right="-5px"
      rounded="full"
      minW="16px"
      minH="16px"
      justifyContent="center"
      display="flex"
    >
      3
    </Badge>
    <IconButton
      variant="ghost"
      border="1px solid #EEEEEE"
      colorScheme="ghost"
      aria-label="Send email"
      isRound
      icon={icon}
      onClick={onClick}
    />
  </Box>
)
