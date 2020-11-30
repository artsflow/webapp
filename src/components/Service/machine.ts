import { createMachine, assign } from 'xstate'
import { createContext } from 'react'
import { isEmpty } from 'lodash'

import { updateService, addService } from 'hooks/services'
import { showAlert } from 'lib/utils'
import { TITLE_LENGTH, DESCRIPTION_LENGTH } from './config'

export const defaultContext: ServiceContext = {
  id: '',
  category: 'visual',
  title: '',
  description: '',
  address: {},
  images: [],
  video: '',
  duration: 0,
  frequency: '',
  capacity: 0,
  price: 0,
  step: 'category',
  published: false,
}

export const Context = createContext({})
export interface ServiceContext {
  id: string
  category: string
  title: string
  description: string
  address: any
  images: string[]
  video: string
  duration: number
  frequency: string
  capacity: number
  price: number
  step: string
  published: boolean
}

interface ServiceEvent {
  type: 'NEXT' | 'PREV' | 'UPDATE' | 'CLEAR' | 'SAVE'
  data: any
  action: string
}

interface MakeStepsProps {
  step: string
  prev: string
  next: string
  cond: string
  extra?: any
}

const makeStep = ({ step, prev, next, cond, extra }: MakeStepsProps) => ({
  [step]: {
    on: {
      PREV: prev,
      NEXT: [{ target: next, cond: { type: cond } }],
      UPDATE: { actions: 'stepUpdate' },
    },
    ...extra,
  },
})
export const makeServiceMachine = (initial: string) =>
  createMachine<ServiceContext, ServiceEvent>(
    {
      key: 'machine',
      initial: initial || 'category',
      context: defaultContext,
      states: {
        category: {
          on: {
            NEXT: 'title',
            UPDATE: { actions: 'stepUpdate' },
          },
        },
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
        }),
        ...makeStep({
          step: 'price',
          prev: 'capacity',
          next: 'complete',
          cond: 'priceValid',
        }),
        complete: {
          on: {
            PREV: 'capacity',
          },
          invoke: { src: 'updateService' },
          // type: 'final',
        },
      },
      on: {
        SAVE: { actions: 'save' },
      },
    },
    {
      actions: {
        save: updateService,
        stepUpdate: assign((ctx, evt, meta) => {
          console.log('stepUpdate: ', ctx)
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
              return { ...ctx, step: meta.state?.value, ...evt.data }
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
        durationValid: () => true,
        frequencyValid: () => true,
        capacityValid: () => true,
        priceValid: () => true,
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
