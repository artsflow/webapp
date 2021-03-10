import { Box } from '@chakra-ui/react'

export function MockiPhone({ children }: any) {
  return (
    <Box
      pos="relative"
      zIndex="0"
      top="0"
      w="240px"
      h="540px"
      _after={{
        content: '""',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '10px',
        width: '80px',
        height: '4px',
        backgroundColor: '#f2f2f2',
        borderRadius: '10px',
        zIndex: '2',
      }}
    >
      <Box
        pos="absolute"
        top="0"
        w="240px"
        h="540px"
        overflowY="scroll"
        zIndex="1"
        borderRadius="16px"
        boxShadow="0px 3.03673px 8.09796px -1.01224px rgba(50, 50, 71, 0.05)"
        bg="white"
      >
        {children}
      </Box>
    </Box>
  )
}
