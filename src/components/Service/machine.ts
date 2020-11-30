import { createMachine, assign } from 'xstate'
import { createContext } from 'react'
import { isEmpty } from 'lodash'

import { updateService } from 'hooks/services'
import { showAlert } from 'lib/utils'
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
  type: 'NEXT' | 'PREV' | 'UPDATE' | 'CLEAR' | 'SAVE'
  data: any
  action: string
}

export const serviceMachine = createMachine<ServiceContext, ServiceEvent>(
  {
    key: 'machine',
    initial: 'category',
    // initial: 'images',
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
          !isEmpty(ctx.address)
        ),
      imagesValid: (ctx) =>
        checkGuard('Upload incomplete', 'Minimum 3 images are required', ctx.images.length >= 3),
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
