import { createMachine, assign } from 'xstate'
import { createContext } from 'react'

import { TITLE_LENGTH, DESCRIPTION_LENGTH } from './config'

const defaultContext: ServiceContext = {
  category: 'visual',
  title: '',
  description: '',
}

export const Context = createContext({})

export const steps = ['category', 'title', 'description']

export interface ServiceContext {
  category: string
  title: string
  description: string
}

interface ServiceEvent {
  type: 'NEXT' | 'PREV' | 'UPDATE'
  data: ServiceContext
}

export const serviceMachine = createMachine<ServiceContext, ServiceEvent>(
  {
    key: 'machine',
    initial: 'category',
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
          NEXT: [{ target: 'complete', cond: { type: 'descriptionValid' } }],
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
    },
  }
)
