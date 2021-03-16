import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

export const steps = [
  'category',
  'details',
  'location',
  'images',
  'duration',
  'frequency',
  'capacity',
  'price',
  // 'complete',
]

export const DURATION_STEP = 15
export const DURATION_MIN = 30
export const DURATION_MAX = 360

export const update = (state: any, payload: any) => ({
  ...state,
  ...payload,
})

export const DevTool = dynamic(() => import('./DevTool'), { ssr: false })

export const getPrevStep = (s: string) => steps[steps.indexOf(s) - 1]
export const getNextStep = (s: string) => steps[steps.indexOf(s) + 1]

export const getLastStep = (step: string, state: any) => {
  const { images, locationGeocode, description, title, category } = state

  let lastStep = step

  if (images.length === 0) lastStep = 'images'
  if (!locationGeocode.lat) lastStep = 'location'
  if (!description || !title) lastStep = 'details'
  if (!category) lastStep = 'category'

  return lastStep
}

export const useCurrentStep = () => {
  const { asPath } = useRouter()
  const [, , , step] = asPath.split('/')
  const currentStep = steps[steps.indexOf(step)] || steps[0]
  return [currentStep, step]
}
