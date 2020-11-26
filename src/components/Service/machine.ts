import { createMachine, assign } from 'xstate'
import { createContext } from 'react'

export const Context = createContext({})
export const steps = ['category', 'title', 'description']

interface ServiceContext {
  category: string[]
  title: string
  description: string
}

interface ServiceEvent {
  type: 'NEXT' | 'PREV' | 'UPDATE'
}

export const serviceMachine = createMachine<ServiceContext, ServiceEvent>(
  {
    key: 'machine',
    initial: 'category',
    context: {
      category: [],
      title: '',
      description: '',
    },
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
          NEXT: 'description',
          UPDATE: { actions: 'stepUpdate' },
        },
      },
      description: {
        on: {
          PREV: 'title',
          NEXT: 'complete',
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
        console.log('stepUpdate: ', ctx, evt)
        return { ...ctx, ...evt }
      }),
    },
  }
)
