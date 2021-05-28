import { Plugin, PluginKey } from '@bangle.dev/core'
import { corePlugins, coreSpec } from '@bangle.dev/core/utils/core-components'
import { toHTMLString } from '@bangle.dev/core/utils/pm-utils'
import { emoji } from '@bangle.dev/emoji'
import { emojiSuggest } from '@bangle.dev/react-emoji-suggest'
import { floatingMenu } from '@bangle.dev/react-menu'
import gemojiData from 'emoji-lookup-data/data/gemoji.json'

export const floatingMenuKey = new PluginKey('floatingMenuKey')
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
      key: floatingMenuKey,
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

export const selectStyles = {
  control: (base: any, { isFocused }: any) => ({
    ...base,
    border: '0px',
    padding: '2px',
    paddingLeft: '8px',
    boxShadow: isFocused ? '0px 0px 0px 1px #47BCC8' : '0px 3px 8px rgba(50, 50, 71, 0.05)',
  }),
  menu: (base: any) => ({
    ...base,
    boxShadow: '0px 3px 8px rgba(50, 50, 71, 0.05)',
  }),
  option: (styles: any, { isFocused }: any) => ({
    ...styles,
    backgroundColor: isFocused ? '#47BCC8' : null,
    color: isFocused ? 'white' : 'black',
  }),
}

export const selectStylesEditor = {
  ...selectStyles,
  control: (base: any, { isFocused }: any) => ({
    ...base,
    padding: '0px',
    boxShadow: isFocused ? '0px 0px 0px 1px #47BCC8' : '1px 1px 1px rgba(50, 50, 71, 0.05)',
  }),
}
