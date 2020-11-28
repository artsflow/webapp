import { createMachine, assign } from 'xstate'
import { createContext } from 'react'
import { isEmpty } from 'lodash'

import { updateService } from 'hooks/services'
import { TITLE_LENGTH, DESCRIPTION_LENGTH } from './config'

export const defaultContext: ServiceContext = {
  id: '',
  category: 'visual',
  title: '',
  description: '',
  address: {},
  images: [],
}

export const Context = createContext({})
export interface ServiceContext {
  id: string
  category: string
  title: string
  description: string
  address: any
  images: string[]
}

interface ServiceEvent {
  type: 'NEXT' | 'PREV' | 'UPDATE' | 'CLEAR'
  data: any
  action: string
}

export const serviceMachine = createMachine<ServiceContext, ServiceEvent>(
  {
    key: 'machine',
    // initial: 'category',
    initial: 'images',
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
        on: {
          PREV: 'description',
          NEXT: [{ target: 'images', cond: { type: 'addressValid' } }],
          UPDATE: { actions: 'stepUpdate' },
        },
      },
      images: {
        on: {
          PREV: 'address',
          NEXT: [{ target: 'complete', cond: { type: 'imagesValid' } }],
          UPDATE: { actions: 'stepUpdate' },
        },
      },
      complete: {
        on: {
          PREV: 'images',
        },
        invoke: {
          id: 'update-service',
          src: updateService,
        },
        // type: 'final',
      },
    },
    on: {
      CLEAR: {
        actions: 'clear',
        target: 'category',
      },
    },
  },
  {
    actions: {
      clear: () => assign(defaultContext),
      stepUpdate: assign((ctx, evt) => {
        // console.log('stepUpdate: ', ctx, evt)
        switch (evt.action) {
          case 'addImage':
            return { ...ctx, images: [...ctx.images, evt.data.imageId] }
          case 'removeImage':
            return { ...ctx, images: ctx.images.filter((id: string) => id !== evt.data.imageId) }
          default:
            return { ...ctx, ...evt.data }
        }
      }),
    },
    guards: {
      titleValid: (ctx) => ctx.title.length >= 20 && ctx.title.length <= TITLE_LENGTH,
      descriptionValid: (ctx) =>
        ctx.description.length > 100 && ctx.title.length <= DESCRIPTION_LENGTH,
      addressValid: (ctx) => !isEmpty(ctx.address),
      imagesValid: (ctx) => ctx.images.length === 3,
    },
  }
)
