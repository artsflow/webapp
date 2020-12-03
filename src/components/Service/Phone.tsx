import { Box } from '@chakra-ui/core'

export function MockiPhone({ children }: any) {
  return (
    <Box
      pos="relative"
      zIndex="0"
      top="0"
      w="280px"
      h="608px"
      _before={{
        content: '""',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: '0px',
        width: '56%',
        height: '20px',
        backgroundColor: '#7e7e7e',
        borderRadius: '0px 0px 40px 40px',
        zIndex: '2',
      }}
      _after={{
        content: '""',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '7px',
        width: '140px',
        height: '4px',
        backgroundColor: '#f2f2f2',
        borderRadius: '10px',
        zIndex: '2',
      }}
    >
      <Box
        pos="absolute"
        top="0"
        w="280px"
        h="608px"
        overflowY="scroll"
        zIndex="1"
        borderRadius="40px"
        boxShadow="0px 0px 0px 11px #7e7e7e, 0px 0px 0px 13px #7e7e7e, 0px 0px 0px 15px #7e7e7e"
      >
        {children}
      </Box>
    </Box>
  )
}
