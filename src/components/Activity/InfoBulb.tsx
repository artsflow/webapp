import { useState, useEffect, useRef } from 'react'
import { Box, VStack, Icon, IconButton, Heading } from '@chakra-ui/react'
import { useOutsideClick } from 'rooks'

import BulbIcon from 'svg/icons/bulb.svg'
import { help } from './help-copy'

export const InfoBulb = ({ step }: any) => {
  const [isOpen, setOpen] = useState(false)
  const pRef = useRef() as any

  useOutsideClick(pRef, () => setOpen(false))

  const handleToggle = () => {
    setOpen(!isOpen)
  }

  useEffect(() => {
    setOpen(false)
  }, [step])

  const { heading, info } = help[step] || {}

  return (
    <VStack pos="relative" alignItems="flex-end" spacing="1.5rem" ref={pRef}>
      <IconButton
        variant="ghost"
        colorScheme="ghost"
        aria-label="Help"
        w="64px"
        h="64px"
        bg="af.teal"
        isRound
        icon={<Icon w="32px" h="32px" as={BulbIcon} />}
        onClick={handleToggle}
        shadow="0px 3px 8px -1px rgba(50, 50, 71, 0.15)"
      />
      <VStack
        shadow="0px 3px 8px -1px rgba(50, 50, 71, 0.05)"
        bg="white"
        rounded="12px"
        p="1.5rem"
        alignItems="flex-start"
        w="300px"
        zIndex="10"
        display={isOpen ? 'flex' : 'none'}
        spacing="1rem"
      >
        <Heading fontSize="1rem">{heading}</Heading>
        <Box color="#616167" fontSize="0.875rem">
          {info}
        </Box>
      </VStack>
    </VStack>
  )
}
