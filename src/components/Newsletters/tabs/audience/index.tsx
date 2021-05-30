import { Box } from '@chakra-ui/react'

import { Add } from './add'

export const Audience = () => {
  console.log('audience render')
  return (
    <>
      <List />
      <Add />
    </>
  )
}

const List = () => {
  console.log('list')
  return <Box mb="1rem">list here</Box>
}
