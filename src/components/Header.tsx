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
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import NextLink from 'next/link'

import Logo from 'svg/artsflow.svg'
import { auth } from 'lib/firebase'
import { useRouter } from 'next/router'
import { UserContext } from 'lib/context'

export function Header() {
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
      gridTemplateColumns="auto 1fr auto"
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
      <VStack ml="auto" mr="4" spacing="0" alignItems="flex-end">
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
          <MenuItem>My Profile</MenuItem>
          <MenuDivider />
          <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </MenuList>
      </Menu>
    </Grid>
  )
}
