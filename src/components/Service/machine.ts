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
        title: {
          on: {
            PREV: 'category',
            NEXT: [{ target: 'description', cond: { type: 'titleValid' } }],
            UPDATE: { actions: 'stepUpdate' },
          },
        },
        description: {
          on: {
            PREV: 'title',
            NEXT: [{ target: 'address', cond: { type: 'descriptionValid' } }],
            UPDATE: { actions: 'stepUpdate' },
          },
        },
        address: {
          invoke: { src: addService },
          on: {
            PREV: 'description',
            NEXT: [{ target: 'images', cond: { type: 'addressValid' } }],
            UPDATE: { actions: 'stepUpdate' },
          },
        },
        images: {
          on: {
            PREV: 'address',
            NEXT: [{ target: 'video', cond: { type: 'imagesValid' } }],
            UPDATE: { actions: 'stepUpdate' },
          },
        },
        video: {
          on: {
            PREV: 'images',
            NEXT: [{ target: 'duration', cond: { type: 'videoValid' } }],
            UPDATE: { actions: 'stepUpdate' },
          },
        },
        duration: {
          on: {
            PREV: 'video',
            NEXT: [{ target: 'frequency', cond: { type: 'durationValid' } }],
            UPDATE: { actions: 'stepUpdate' },
          },
        },
        frequency: {
          on: {
            PREV: 'duration',
            NEXT: [{ target: 'capacity', cond: { type: 'frequencyValid' } }],
            UPDATE: { actions: 'stepUpdate' },
          },
        },
        capacity: {
          on: {
            PREV: 'frequency',
            NEXT: [{ target: 'price', cond: { type: 'capacityValid' } }],
            UPDATE: { actions: 'stepUpdate' },
          },
        },
        price: {
          on: {
            PREV: 'capacity',
            NEXT: [{ target: 'complete', cond: { type: 'priceValid' } }],
            UPDATE: { actions: 'stepUpdate' },
          },
        },
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
