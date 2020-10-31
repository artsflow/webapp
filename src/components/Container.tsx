import { Flex, FlexProps } from '@chakra-ui/core'

export const Container = (props: FlexProps): JSX.Element => (
  <Flex direction="column" alignItems="center" justifyContent="flex-start" {...props} />
)
