import { Grid, Box, Link, Button, HStack } from '@chakra-ui/core'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import { useUser, GET_ME } from 'hooks'
import Logo from 'svg/artsflow.svg'

import { logout } from 'services/auth'
import { client } from 'services/client'

export function Header() {
  const { user } = useUser()
  const router = useRouter()
  const { mutate } = useSWR(GET_ME, (query) => client.request(query))

  if (!user) return <div />

  const handleLogout = async () => {
    await logout()
    mutate()
    router.push('/')
  }

  return (
    <Grid as="nav" py="4" px="4" gridTemplateColumns="auto auto 1fr auto" alignItems="center">
      <Box mx="8">
        <NextLink href="/">
          <Link>
            <Logo width="107px" height="24px" />
          </Link>
        </NextLink>
      </Box>
      <HStack mx="8" spacing="8">
        <NextLink href="/service/add">
          <Link>Add Service</Link>
        </NextLink>
        <NextLink href="/list">
          <Link>List services</Link>
        </NextLink>
      </HStack>
      <Box mx="8" ml="auto">
        {user?.email}
      </Box>
      <Box>
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
    </Grid>
  )
}
