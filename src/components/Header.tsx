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
import { ChevronDownIcon, WarningTwoIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'

import Logo from 'svg/artsflow.svg'
import BellIcon from 'svg/icons/bell.svg'
import ChatIcon from 'svg/icons/chat.svg'

import { auth } from 'lib/firebase'
import { useRouter } from 'next/router'
import { UserContext } from 'lib/context'
import { Notifications } from 'components'
import { getImageKitUrl } from 'lib/utils'

import packageInfo from '../../package.json'

const { version } = packageInfo

export function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, profile } = useContext(UserContext)
  const router = useRouter()

  console.log(user)

  const handleLogout = () => {
    auth.signOut()
    router.push('/')
  }

  return (
    <Grid
      as="nav"
      py="4"
      px="2rem"
      gridTemplateColumns="auto 1fr auto 1fr auto auto"
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
      <HStack mt="10px" pl="1rem">
        {!user.isVerified && (
          <NextLink href="/">
            <Link>
              <HStack>
                <WarningTwoIcon color="af.pink" />
                <Text fontSize="12px" color="af.pink" fontWeight="bold">
                  Account not verified - Click here to verfy!
                </Text>
              </HStack>
            </Link>
          </NextLink>
        )}
      </HStack>
      <HStack ml="auto" spacing="1rem" borderRight="1px solid #ECEDF1" mr="1.5rem" pr="1.5rem">
        <RoundButton icon={<Icon as={ChatIcon} />} onClick={() => router.push('/chat')} />
        <RoundButton icon={<Icon as={BellIcon} />} onClick={onOpen} />
      </HStack>
      <VStack mr="4" spacing="0" alignItems="flex-end">
        {user?.displayName ? (
          <>
            <Text fontSize="14px" fontWeight="bold">
              {user?.displayName}
            </Text>
            <Text fontSize="12px" color="#8e8e93">
              Practitioner
            </Text>
          </>
        ) : (
          <NextLink href="/profile">
            <Link>
              <Text fontSize="sm" fontWeight="bold" color="af.teal">
                Complete your profile
              </Text>
            </Link>
          </NextLink>
        )}
      </VStack>
      <Menu>
        <MenuButton
          as={Button}
          variant="unstyled"
          display="flex"
          flexDirection="row"
          rightIcon={<ChevronDownIcon color="#8e8e93" />}
        >
          <Avatar
            name={user?.displayName}
            width="36px"
            height="36px"
            bg="af.pink"
            color="white"
            fontSize="xs"
            src={getImageKitUrl(profile?.photoURL, { w: 36, h: 36, tr: 'fo-face' })}
          />
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
