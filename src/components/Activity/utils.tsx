import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { omit } from 'lodash'
import { Plugin, PluginKey } from '@bangle.dev/core'
import { corePlugins, coreSpec } from '@bangle.dev/core/utils/core-components'
import { toHTMLString } from '@bangle.dev/core/utils/pm-utils'
import { emoji } from '@bangle.dev/emoji'
import { emojiSuggest } from '@bangle.dev/react-emoji-suggest'
import gemojiData from 'emoji-lookup-data/data/gemoji.json'

export const initialStore = {
  activityType: '',
  activityPresence: '',
  presenceUrl: '',
  audienceType: '',
  audienceLevel: '',
  category: '',
  categoryType: '',
  title: '',
  description: '',
  location: {
    address: '',
    town: '',
    details: '',
    geocode: {},
    geohash: '',
    placeId: '',
  },
  images: [],
  duration: 0,
  dates: [],
  capacity: 10,
  price: 20,
  isFeePassed: false,
  monetizationType: 'Free',
  meta: {
    actionType: 'add',
  },
}

export const steps = [
  'options',
  'category',
  'details',
  'location',
  'images',
  'duration',
  'dates',
  'capacity',
  'price',
  'published',
]

export const DURATION_STEP = 15
export const DURATION_MIN = 30
export const DURATION_MAX = 360

export const update = (state: any, payload: any) => ({
  ...state,
  ...payload,
})

export const resetStore = () => initialStore

export const cleanStore = (state: any) => omit(state, ['meta', 'userId'])

export const DevTool = dynamic(() => import('./DevTool'), { ssr: false })

export const getPrevStep = (s: string, skip: number) => steps[steps.indexOf(s) - 1 - skip]
export const getNextStep = (s: string, skip: number) => steps[steps.indexOf(s) + 1 + skip]
export const isLastStep = (s: string) => steps.indexOf(s) === steps.length - 2

export const useCurrentStep = () => {
  const { asPath } = useRouter()
  const [, , , step] = asPath.split('/')
  const currentStep = steps[steps.indexOf(step)] || steps[0]
  return [currentStep, step]
}

export const isValidState = (state: any) => {
  // TODO: check against all state fields
  const { activityType, activityPresence, presenceUrl, audienceType, audienceLevel } = state

  const needsPresenceUrl = !(activityPresence === 'Online' && !presenceUrl)
  const isValid = !!activityType && !!activityPresence && !!audienceType && !!audienceLevel

  return isValid && needsPresenceUrl
}

export const emojiSuggestKey = new PluginKey('emojiSuggestKey')

export const getEditorConfig = (onChange: any, initialValue: any) => ({
  specs: [
    ...coreSpec(),
    emoji.spec({
      getEmoji: (emojiAlias: any) => getEmojiByAlias(emojiAlias) || ['question', '❓'],
    }),
    emojiSuggest.spec({ markName: 'emojiSuggest' }),
  ],
  plugins: () => [
    corePlugins(),
    new Plugin({
      view: () => ({
        update: (view: any, prevState: any) => {
          if (!view.state.doc.eq(prevState.doc)) {
            onChange?.({ target: { value: toHTMLString(view.state) } })
            // onChange?.(toHTMLString(view.state))
            localStorage.setItem('af-editor-value', JSON.stringify(view.state.doc.toJSON()))
          }
        },
      }),
    }),
    emoji.plugins(),
    emojiSuggest.plugins({
      key: emojiSuggestKey,
      getEmojiGroups: (queryText: string) => {
        if (!queryText) {
          return emojiData
        }
        return emojiData
          .map((group: any) => ({
            name: group.name,
            emojis: group.emojis.filter(([emojiAlias]: [string]) => emojiAlias.includes(queryText)),
          }))
          .filter((group: any) => group.emojis.length > 0)
      },
      markName: 'emojiSuggest',
      tooltipRenderOpts: {
        placement: 'bottom',
      },
    }),
  ],
  initialValue,
})

const emojiData = Object.values(
  gemojiData.reduce((prev: any, obj) => {
    if (!prev[obj.category]) {
      prev[obj.category] = { name: obj.category, emojis: [] }
    }
    prev[obj.category].emojis.push([obj.aliases[0], obj.emoji])

    return prev
  }, {})
) as any

const getEmojiByAlias = (emojiAlias: any) => {
  for (const { emojis } of emojiData) {
    const match = emojis.find((e: any) => e[0] === emojiAlias)
    if (match) {
      return match
    }
  }
  return null
}
