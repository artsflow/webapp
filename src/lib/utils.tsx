import { createStandaloneToast, forwardRef } from '@chakra-ui/react'
import { motion, isValidMotionProp } from 'framer-motion'
import Papa from 'papaparse'
import { format, fromUnixTime } from 'date-fns'

export const isProd = process.env.NODE_ENV === 'production'

const toast = createStandaloneToast()

interface AlertProps {
  title: string
  description?: string
  status?: 'error' | 'success' | 'warning' | 'info'
}

export const showAlert = ({ title, description, status = 'error' }: AlertProps) =>
  toast({
    title,
    description,
    status,
    duration: 3000,
    isClosable: true,
    position: 'bottom',
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

export const activityDownload = (list: any) => {
  const fields = [
    'Activity id',
    'Title',
    'Amount',
    'Activity date',
    'Name',
    'Email',
    'Phone',
    'Booking date',
  ]
  const data = list.map((a: any) => [
    a.activityId,
    a.title,
    a.amount / 100,
    format(fromUnixTime(a.timestamp), 'dd MMM, HH:mm'),
    a.name,
    a.email,
    a.phone,
    format(fromUnixTime(a.createdAt.seconds), 'dd MMM, HH:mm'),
  ])
  const csv = Papa.unparse({
    data,
    fields,
  })
  const blob = new Blob([csv])
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  const [{ activityId, title }] = list
  a.download = `${activityId} ${title}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
