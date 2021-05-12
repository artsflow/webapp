import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { omit } from 'lodash'

export const initialStore = {
  activityType: '',
  activityPresence: '',
  presenceUrl: '',
  audienceType: '',
  audienceLevel: '',
  category: '',
  categoryType: '',
  title: '',
  description: '',
  whatToBring: '',
  location: {
    address: '',
    town: '',
    details: '',
    geocode: {},
    geohash: '',
    placeId: '',
  },
  images: [],
  duration: 0,
  dates: [],
  capacity: 1,
  price: 5,
  monetizationType: 'Paid',
  meta: {
    actionType: 'add',
  },
}

export const steps = [
  'options',
  'category',
  'details',
  'location',
  'images',
  'duration',
  'dates',
  'capacity',
  'price',
  'published',
]

export const DURATION_STEP = 15
export const DURATION_MIN = 30
export const DURATION_MAX = 360

export const update = (state: any, payload: any) => ({
  ...state,
  ...payload,
})

export const resetStore = () => initialStore

export const cleanStore = (state: any) => omit(state, ['meta', 'userId'])

export const DevTool = dynamic(() => import('./DevTool'), { ssr: false })

export const getPrevStep = (s: string) => steps[steps.indexOf(s) - 1]
export const getNextStep = (s: string) => steps[steps.indexOf(s) + 1]
export const isLastStep = (s: string) => steps.indexOf(s) === steps.length - 2

export const useCurrentStep = () => {
  const { asPath } = useRouter()
  const [, , , step] = asPath.split('/')
  const currentStep = steps[steps.indexOf(step)] || steps[0]
  return [currentStep, step]
}

export const isValidState = (state: any) => {
  // TODO: check against all state fields
  const { activityType, activityPresence, presenceUrl, audienceType, audienceLevel } = state

  const needsPresenceUrl = !(activityPresence === 'Online' && !presenceUrl)
  const isValid = !!activityType && !!activityPresence && !!audienceType && !!audienceLevel

  return isValid && needsPresenceUrl
}
