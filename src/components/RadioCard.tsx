import { Box, useRadio } from '@chakra-ui/react'

export function RadioCard(props: any) {
  const { getInputProps, getCheckboxProps } = useRadio(props)
  const { children } = props

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label" mb="1rem" mr="1rem">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderRadius="12px"
        boxShadow="lg"
        fontSize="sm"
        bg="white"
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px="20px"
        py="12px"
      >
        {children}
      </Box>
    </Box>
  )
}
