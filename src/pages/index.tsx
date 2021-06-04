import { useContext } from 'react'
import { Heading, Box } from '@chakra-ui/react'

import { UserContext } from 'lib/context'
import { Meta, Onboarding } from 'components'

export default function Home(): JSX.Element {
  const { user } = useContext(UserContext)

  return (
    <>
      <Meta title="Artsflow" />
      <Box p="40px">
        <Heading fontSize="lg" mb="1rem">
          Welcome to Artsflow, {user.firstName}
        </Heading>
        <Onboarding />
      </Box>
    </>
  )
}
