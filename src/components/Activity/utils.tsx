import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { rrulestr } from 'rrule'
import { format, addMinutes } from 'date-fns'
import { omit } from 'lodash'

export const initialStore = {
  category: '',
  categoryType: '',
  title: '',
  description: '',
  whatToBring: '',
  location: {
    address: '',
    details: '',
    geocode: {},
    geohash: '',
    placeId: '',
  },
  images: [],
  duration: 0,
  frequency: {
    rrules: [],
    exdate: [],
  },
  capacity: 1,
  price: 5,
  type: 'Paid',
  meta: {
    actionType: 'add',
  },
}

export const steps = [
  'category',
  'details',
  'location',
  'images',
  'duration',
  'frequency',
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

export const ruleText = (r: string, duration: number) => {
  const rule = rrulestr(r)
  const from = format(rule.options.dtstart, 'HH:mm')
  const to = format(addMinutes(rule.options.dtstart, duration), 'HH:mm')
  const [freq, days] = rule.toText().replace(' for 15 times', '').split(' on ')
  return { freq, days, time: `${from} - ${to}` }
}

export const isValidState = (state: any) =>
  // TODO: check against all state fields
  !!state.category
