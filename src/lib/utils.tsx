import { createStandaloneToast, forwardRef } from '@chakra-ui/react'
import { motion, isValidMotionProp } from 'framer-motion'

export const isProd = process.env.NODE_ENV === 'production'

const toast = createStandaloneToast()

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

export const motionComponent = (Component: any) =>
  motion.custom(
    // @ts-ignore
    forwardRef((props, ref) => {
      const chakraProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => !isValidMotionProp(key))
      )
      return <Component ref={ref} {...chakraProps} />
    })
  )

export const getImageKitUrl = (url: string, options: any = {}) => {
  const { w = '150', h = '150', tr = 'fo-auto' } = options
  if (url?.includes('firebasestorage.googleapis.com')) {
    return url.replace(
      'firebasestorage.googleapis.com',
      `ik.imagekit.io/artsflow/tr:w-${w},h-${h},${tr}`
    )
  }
  return url
}
