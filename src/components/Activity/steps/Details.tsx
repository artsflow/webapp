import {
  Flex,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Heading,
  Textarea,
  Tooltip,
  HStack,
} from '@chakra-ui/react'
import { QuestionOutlineIcon } from '@chakra-ui/icons'

import { TITLE_LENGTH, DESCRIPTION_LENGTH } from '../config'

export function Details() {
  return (
    <Flex justifyContent="space-between" alignItems="flex-start" p="40px">
      <Flex direction="column" alignItems="flex-start">
        <Heading size="md" mb="1rem">
          Add Details
        </Heading>
        <Text color="#616167" mb="2rem">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
        </Text>

        <HStack>
          <Text fontWeight="bold" alignItems="center">
            Activity Title
          </Text>
        </HStack>
        <InputGroup mb="1rem">
          <Input
            my="4"
            pr="60px"
            placeholder="Add activity title..."
            bg="white"
            border="none"
            shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
            autoFocus
          />
          <InputRightElement
            my="4"
            mr="2"
            fontSize="xs"
            children={`${0} / ${TITLE_LENGTH}`}
            color="gray.400"
          />
        </InputGroup>

        <HStack>
          <Text fontWeight="bold" alignItems="center">
            Description
          </Text>
        </HStack>
        <InputGroup mb="1rem">
          <Textarea
            my="4"
            placeholder="Enter description..."
            rows={7}
            bg="white"
            border="none"
            shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
          />
          <InputRightElement
            mt="1rem"
            mr="3px"
            w="80px"
            color="gray.400"
            fontSize="xs"
            children={`${0} / ${DESCRIPTION_LENGTH}`}
          />
        </InputGroup>

        <HStack>
          <Text fontWeight="bold" alignItems="center">
            What to bring
          </Text>
          <Tooltip label="More info here about what what to bring..." fontSize="md">
            <QuestionOutlineIcon color="gray.400" />
          </Tooltip>
        </HStack>
        <InputGroup>
          <Textarea
            my="4"
            placeholder="List what to bring"
            rows={7}
            bg="white"
            border="none"
            shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
          />
          <InputRightElement
            mt="1rem"
            mr="3px"
            w="80px"
            color="gray.400"
            fontSize="xs"
            children={`${0} / ${DESCRIPTION_LENGTH}`}
          />
        </InputGroup>
      </Flex>
    </Flex>
  )
}
