import { loremIpsum } from 'react-lorem-ipsum'
import { Box, Text } from '@chakra-ui/core'

export const LoremIpsum = ({ p = 2 }) => (
  <Box>
    {loremIpsum({ p, avgSentencesPerParagraph: 4 }).map((text) => (
      <Text my="2" key={text}>
        {text}
      </Text>
    ))}
  </Box>
)
