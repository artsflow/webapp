import { Grid, Box, Link } from '@chakra-ui/core'
import NextLink from 'next/link'

import { useUser } from 'hooks'
import Logo from 'svg/artsflow.svg'

export function Header() {
  const { user } = useUser()
  if (!user) return <div />
  return (
    <Grid as="nav" py="4" px="4" gridTemplateColumns="auto auto 1fr auto" alignItems="center">
      <Box mx="8">
        <NextLink href="/">
          <Link>
            <Logo width="107px" height="24px" />
          </Link>
        </NextLink>
      </Box>
      <Box mx="8">
        <NextLink href="/add">
          <Link>Add Activity</Link>
        </NextLink>
      </Box>
      <Box mx="8" ml="auto">
        {user?.email}
      </Box>
      <Box>
        <Link href="/api/logout">Logout</Link>
      </Box>
    </Grid>
  )
}
