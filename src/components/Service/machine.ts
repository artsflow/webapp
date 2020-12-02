import { createMachine, assign } from 'xstate'
import { createContext } from 'react'
import { isEmpty } from 'lodash'

import { updateService, addService } from 'hooks/services'
import { showAlert } from 'lib/utils'
import { TITLE_LENGTH, DESCRIPTION_LENGTH, DURATION_MIN, DURATION_MAX } from './config'

export const defaultContext: ServiceContext = {
  id: '',
  category: 'visual',
  title: '',
  description: '',
  address: {},
  images: [],
  video: '',
  duration: 60,
  frequency: { rrules: [], exdate: [] },
  capacity: 1,
  price: 20,
  step: 'category',
  published: false,
  meta: {
    isDirty: false,
  },
}

export const Context = createContext({})

export interface Meta {
  isDirty: boolean
}
interface Frequency {
  rrules: string[]
  exdate: string[]
}
export interface ServiceContext {
  id: string
  category: string
  title: string
  description: string
  address: any
  images: string[]
  video: string
  duration: number
  frequency: Frequency
  capacity: number
  price: number
  step: string
  published: boolean
  meta: Meta
}

interface ServiceEvent {
  type: 'NEXT' | 'PREV' | 'UPDATE' | 'SAVE'
  data: any
  action: string
}

interface MakeStepsProps {
  step: string
  prev?: string
  next?: string
  cond?: string
  extra?: any
}

const makeStep = ({ step, prev, next, cond, extra }: MakeStepsProps) => ({
  [step]: {
    on: {
      PREV: prev,
      NEXT: [{ target: next, cond: cond && { type: cond } }],
      UPDATE: { actions: 'stepUpdate' },
    },
    ...extra,
  },
})

const extra = {
  invoke: {
    src: updateService,
    onDone: { actions: assign({ meta: { isDirty: false } }) },
  },
}

export const makeServiceMachine = (initial: string) =>
  createMachine<ServiceContext, ServiceEvent>(
    {
      key: 'machine',
      initial: initial === 'complete' ? 'category' : initial,
      context: defaultContext,
      states: {
        ...makeStep({
          step: 'category',
          next: 'title',
        }),
        ...makeStep({
          step: 'title',
          prev: 'category',
          next: 'description',
          cond: 'titleValid',
        }),
        ...makeStep({
          step: 'description',
          prev: 'title',
          next: 'address',
          cond: 'descriptionValid',
        }),
        ...makeStep({
          step: 'address',
          prev: 'description',
          next: 'images',
          cond: 'addressValid',
          extra: {
            invoke: { src: addService },
          },
        }),
        ...makeStep({
          step: 'images',
          prev: 'address',
          next: 'video',
          cond: 'imagesValid',
        }),
        ...makeStep({
          step: 'video',
          prev: 'images',
          next: 'duration',
          cond: 'videoValid',
        }),
        ...makeStep({
          step: 'duration',
          prev: 'video',
          next: 'frequency',
          cond: 'durationValid',
        }),
        ...makeStep({
          step: 'frequency',
          prev: 'duration',
          next: 'capacity',
          cond: 'frequencyValid',
        }),
        ...makeStep({
          step: 'capacity',
          prev: 'frequency',
          next: 'price',
          cond: 'capacityValid',
          extra,
        }),
        ...makeStep({
          step: 'price',
          prev: 'capacity',
          next: 'complete',
          cond: 'priceValid',
        }),
        ...makeStep({
          step: 'complete',
          prev: 'price',
          extra,
        }),
      },
      on: {
        SAVE: { actions: 'save' },
      },
    },
    {
      actions: {
        save: updateService,
        stepUpdate: assign((ctx, evt, meta) => {
          switch (evt.action) {
            case 'addImage':
              return { ...ctx, step: meta.state?.value, images: [...ctx.images, evt.data.imageId] }
            case 'removeImage':
              return {
                ...ctx,
                step: meta.state?.value,
                images: ctx.images.filter((id: string) => id !== evt.data.imageId),
              }
            default:
              return {
                ...ctx,
                step: ctx.step === 'complete' ? ctx.step : meta.state?.value,
                ...evt.data,
              }
          }
        }),
      },
      guards: {
        titleValid: (ctx) =>
          checkGuard(
            'Invalid title',
            'Title should have minimum 20 characters',
            ctx.title.length >= 20 && ctx.title.length <= TITLE_LENGTH
          ),
        descriptionValid: (ctx) =>
          checkGuard(
            'Invalid description',
            'Description should have minimum 100 characters',
            ctx.description.length > 100 && ctx.description.length <= DESCRIPTION_LENGTH
          ),
        addressValid: (ctx) =>
          checkGuard(
            'Invalid address',
            'You need to select an address from the list',
            !isEmpty(ctx.address?.country)
          ),
        imagesValid: (ctx) =>
          checkGuard('Upload incomplete', 'Minimum 3 images are required', ctx.images.length >= 3),
        videoValid: () => true,
        durationValid: (ctx) =>
          checkGuard(
            'Invalid duration',
            'Duration is between 30 and 360 minutes',
            ctx.duration >= DURATION_MIN && ctx.duration <= DURATION_MAX
          ),
        frequencyValid: (ctx) =>
          checkGuard(
            'Invalid frequency',
            'Frequency is not set up',
            !isEmpty(ctx.frequency.rrules)
          ),
        capacityValid: (ctx) =>
          checkGuard('Invalid capacity', 'Capacity is not a number', !!Number(ctx.capacity)),
        priceValid: (ctx) =>
          checkGuard('Invalid price', 'Price is not a number', !!Number(ctx.price)),
      },
    }
  )

const checkGuard = (title: string, description: string, cond: boolean) => {
  if (!cond)
    showAlert({
      title,
      description,
    })
  return cond
}
