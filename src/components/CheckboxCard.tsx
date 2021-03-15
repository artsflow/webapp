import { Box, useCheckbox } from '@chakra-ui/react'

export function CheckboxCard(props: any) {
  const { getInputProps, getCheckboxProps } = useCheckbox(props)
  const { children } = props

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label" mb="1rem">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderRadius="12px"
        boxShadow="lg"
        fontSize="sm"
        borderWidth="1px"
        borderColor="white"
        bg="white"
        _checked={{
          bg: '#e7f3f4',
          color: '#47bcc8',
          borderColor: '#47bcc8',
        }}
        px="20px"
        py="10px"
      >
        {children}
      </Box>
    </Box>
  )
}
