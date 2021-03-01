import { Grid, Box, Link, Button, HStack } from '@chakra-ui/react'
import NextLink from 'next/link'
// import { useRouter } from 'next/router'

import Logo from 'svg/artsflow.svg'

export function Header() {
  // const router = useRouter()
  const handleLogout = async () => {
    console.log('handleLogout')
    // router.push('/')
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
        user
      </Box>
      <Box>
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
    </Grid>
  )
}
