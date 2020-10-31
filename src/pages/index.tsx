import { Text } from '@chakra-ui/core'

import Logo from 'svg/artsflow.svg'
import { Container } from 'components'

export default function Home(): JSX.Element {
  return (
    <Container height="100vh" justifyContent="center">
      <Logo width="242px" />
      <Text>Login</Text>
    </Container>
  )
}
