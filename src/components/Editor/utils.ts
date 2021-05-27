import { Plugin, PluginKey } from '@bangle.dev/core'
import { corePlugins, coreSpec } from '@bangle.dev/core/utils/core-components'
import { toHTMLString } from '@bangle.dev/core/utils/pm-utils'
import { emoji } from '@bangle.dev/emoji'
import { emojiSuggest } from '@bangle.dev/react-emoji-suggest'
import { floatingMenu } from '@bangle.dev/react-menu'
import gemojiData from 'emoji-lookup-data/data/gemoji.json'

const menuKey = new PluginKey('menuKey')
export const emojiSuggestKey = new PluginKey('emojiSuggestKey')

export const getEditorConfig = (onChange: any) => ({
  specs: [
    ...coreSpec(),
    emoji.spec({
      getEmoji: (emojiAlias: any) => getEmojiByAlias(emojiAlias) || ['question', '❓'],
    }),
    emojiSuggest.spec({ markName: 'emojiSuggest' }),
  ],
  plugins: () => [
    corePlugins(),
    floatingMenu.plugins({
      key: menuKey,
    }),
    new Plugin({
      view: () => ({
        update: (view: any, prevState: any) => {
          if (!view.state.doc.eq(prevState.doc)) {
            onChange(toHTMLString(view.state))
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
  initialValue: getItemFromStorage() || '',
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

const getItemFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('af-editor-value') as any)
  } catch (err) {
    return null
  }
}
