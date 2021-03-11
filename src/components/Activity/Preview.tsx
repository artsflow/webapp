import React from 'react'
import { Flex, Heading, HStack, Icon, Box, VStack, Text } from '@chakra-ui/react'
import { useStateMachine } from 'little-state-machine'

import ImgSvg from 'svg/icons/img.svg'
import { MockiPhone } from './Phone'

export function Preview(): JSX.Element {
  const { state } = useStateMachine() as any
  const { category, title, description } = state

  const titleSelected = !title && !!category
  const descriptionSelected = !description && !titleSelected && !!category

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      borderLeft="1px solid #ECEDF1"
      p="40px"
    >
      <Heading fontSize="0.75rem" mb="1.5rem">
        Activity Preview
      </Heading>
      <MockiPhone>
        <MockImg />
        <VStack alignItems="flex-start" p="22px">
          <Category text={category} />
          <Title text={title} isSelected={titleSelected} />
          <Description text={description} isSelected={descriptionSelected} />
        </VStack>
      </MockiPhone>
    </Flex>
  )
}

const MockImg = () => (
  <VStack
    h="180px"
    bg="#E2E4E7"
    justifyContent="space-between"
    alignItems="center"
    pt="10px"
    pb="24px"
  >
    <HStack justifyContent="space-between" w="full" px="1rem">
      <Box w="20px" h="10px" bg="gray.100" rounded="16px" />
      <HStack>
        <Box w="10px" h="10px" bg="gray.100" rounded="full" />
        <Box w="10px" h="10px" bg="gray.100" rounded="full" />
        <Box w="15px" h="10px" bg="gray.100" rounded="16px" />
      </HStack>
    </HStack>
    <Icon as={ImgSvg} w="100px" h="100px" />
    <HStack>
      <Box w="4px" h="4px" rounded="full" bg="gray.300" />
      <Box w="4px" h="4px" rounded="full" bg="white" />
      <Box w="4px" h="4px" rounded="full" bg="gray.300" />
      <Box w="4px" h="4px" rounded="full" bg="gray.300" />
    </HStack>
  </VStack>
)

const Category = ({ text }: any) =>
  text ? (
    <Text color="#E17BAF" fontSize="13px" fontWeight="bold">
      {text}
    </Text>
  ) : (
    <Box w="66px" h="8px" bg="#E17BAF" rounded="1rem" mb="0.5rem" />
  )

const Title = ({ text, isSelected }: any) =>
  text ? (
    <Text fontSize="1rem" fontWeight="semibold">
      {text}
    </Text>
  ) : (
    <>
      <Box w="180px" h="1rem" rounded="1rem" bg={isSelected ? 'gray.400' : 'gray.200'} />
      <Box
        w="200px"
        h="1rem"
        rounded="1rem"
        bg={isSelected ? 'gray.400' : 'gray.200'}
        mb="0.5rem"
      />
    </>
  )

const Description = ({ text, isSelected }: any) =>
  text ? (
    <Box>
      <Box h="100px" overflow="hidden" pos="relative">
        <Text fontSize="12px" color="#616167">
          {text}
        </Text>
        <Box
          pos="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 100%);"
        />
      </Box>
      {text.length > 150 && (
        <Text color="#47BCC8" fontWeight="bold" fontSize="12px">
          + Read more
        </Text>
      )}
    </Box>
  ) : (
    <>
      <Box w="150px" h="0.5rem" rounded="1rem" bg={isSelected ? 'gray.400' : 'gray.200'} />
      <Box w="180px" h="0.5rem" rounded="1rem" bg={isSelected ? 'gray.400' : 'gray.200'} />
      <Box w="135px" h="0.5rem" rounded="1rem" bg={isSelected ? 'gray.400' : 'gray.200'} />
    </>
  )
