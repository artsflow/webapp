import { useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { Meta } from 'components'
import { updateUserVerification } from 'api'

export default function Home(): JSX.Element {
  const router = useRouter()

  const updateVerification = async () => {
    await updateUserVerification()
    router.push('/')
  }

  useEffect(() => {
    updateVerification()
  }, [])

  return (
    <>
      <Meta title="Artsflow" />
      <Box p="40px">loading...</Box>
    </>
  )
}
