import dynamic from 'next/dynamic'

export const steps = [
  'category',
  'details',
  'location',
  // 'images',
  // 'video',
  // 'duration',
  // 'frequency',
  // 'capacity',
  // 'price',
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
export const getCurrentStep = (s: string) => steps[steps.indexOf(s)] || steps[0]
