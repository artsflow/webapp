import { Text, VStack, HStack, Icon, Skeleton } from '@chakra-ui/react'

export const Card = ({ icon, text, subtext, loading }: any) => (
  <HStack
    bg="white"
    p="1rem"
    rounded="12px"
    spacing="1rem"
    minW="200px"
    boxShadow="0px 2px 6px rgba(0, 0, 0, 0.02)"
  >
    <Icon as={icon} boxSize="60px" />
    <VStack alignItems="flex-start">
      <Text color="#616167" fontSize="14px">
        {text}
      </Text>
      <Skeleton
        as={Text}
        isLoaded={!loading}
        startColor="af.teal"
        endColor="af.pink"
        fontSize="18px"
        fontWeight="bold"
        minW="40px"
      >
        {subtext}
      </Skeleton>
    </VStack>
  </HStack>
)
