import { loremIpsum } from 'react-lorem-ipsum'
import { Box, Text, createStandaloneToast } from '@chakra-ui/core'

const toast = createStandaloneToast()

export const LoremIpsum = ({ p = 2 }) => (
  <Box>
    {loremIpsum({ p, avgSentencesPerParagraph: 4 }).map((text) => (
      <Text my="2" key={text}>
        {text}
      </Text>
    ))}
  </Box>
)

interface AlertProps {
  title: string
  description: string
  status?: 'error' | 'success' | 'warning' | 'info'
}

export const showAlert = ({ title, description, status = 'error' }: AlertProps) =>
  toast({
    title,
    description,
    status,
    duration: 5000,
    isClosable: true,
    position: 'top',
  })
