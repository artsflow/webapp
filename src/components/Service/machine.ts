import { createMachine, assign } from 'xstate'
import { createContext } from 'react'
import { isEmpty } from 'lodash'

import { TITLE_LENGTH, DESCRIPTION_LENGTH } from './config'

const defaultContext: ServiceContext = {
  category: 'visual',
  title: '',
  description: '',
  address: {},
}

export const Context = createContext({})
export interface ServiceContext {
  category: string
  title: string
  description: string
  address: any
}

interface ServiceEvent {
  type: 'NEXT' | 'PREV' | 'UPDATE'
  data: ServiceContext
}

export const serviceMachine = createMachine<ServiceContext, ServiceEvent>(
  {
    key: 'machine',
    initial: 'address',
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
          NEXT: [{ target: 'complete', cond: { type: 'addressValid' } }],
          UPDATE: { actions: 'stepUpdate' },
        },
      },
      complete: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      stepUpdate: assign((ctx, evt) => {
        // console.log('stepUpdate: ', ctx, evt)
        return { ...ctx, ...evt.data }
      }),
    },
    guards: {
      titleValid: (ctx) => ctx.title.length > 20 && ctx.title.length <= TITLE_LENGTH,
      descriptionValid: (ctx) =>
        ctx.description.length > 100 && ctx.title.length <= DESCRIPTION_LENGTH,
      addressValid: (ctx) => !isEmpty(ctx.address),
    },
  }
)
