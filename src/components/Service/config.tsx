import { memo } from 'react'
import { LoremIpsum } from 'lib/utils'

export const steps = [
  'category',
  'title',
  'description',
  'address',
  'images',
  'video',
  'duration',
  'frequency',
  'capacity',
  'price',
  'complete',
]

export const TITLE_LENGTH = 80
export const DESCRIPTION_LENGTH = 1000

export const nextStep = (s: string) => steps[steps.indexOf(s) + 1]

export const DURATION_STEP = 15
export const DURATION_MIN = 30
export const DURATION_MAX = 360

export const Lipsum = memo(({ p = 1 }: any) => <LoremIpsum p={p} />)
