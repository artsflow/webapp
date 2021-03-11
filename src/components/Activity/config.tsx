export const steps = [
  'category',
  'details',
  // 'address',
  // 'images',
  // 'video',
  // 'duration',
  // 'frequency',
  // 'capacity',
  // 'price',
  // 'complete',
]

export const TITLE_LENGTH = 80
export const DESCRIPTION_LENGTH = 1000

export const getPrevStep = (s: string) => steps[steps.indexOf(s) - 1]
export const getNextStep = (s: string) => steps[steps.indexOf(s) + 1]
export const getCurrentStep = (s: string) => steps[steps.indexOf(s)] || steps[0]

export const DURATION_STEP = 15
export const DURATION_MIN = 30
export const DURATION_MAX = 360
