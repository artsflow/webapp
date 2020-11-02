import Link from 'next/link'
import { Flex, Box, Stack, Link as ChakraLink } from '@chakra-ui/core'

export const Footer = () => (
  <Flex
    as="footer"
    py="1rem"
    h="3rem"
    justifyContent="center"
    borderTop="1px"
    borderTopColor="grey"
  >
    <Stack spacing={4} direction="row" align="center">
      <Box>
        <Link as="/terms" href="/terms">
          <ChakraLink>Terms</ChakraLink>
        </Link>
      </Box>
    </Stack>
  </Flex>
)
