import React, { useState } from 'react'
import { BangleEditor, useEditorState } from '@bangle.dev/react'
import { PluginKey, Plugin } from '@bangle.dev/core'
import { corePlugins, coreSpec } from '@bangle.dev/core/utils/core-components'
import { toHTMLString } from '@bangle.dev/core/utils/pm-utils'
import { emoji } from '@bangle.dev/emoji'
import { emojiSuggest, EmojiSuggest } from '@bangle.dev/react-emoji-suggest'
import gemojiData from 'emoji-lookup-data/data/gemoji.json'
import {
  floatingMenu,
  StaticMenu,
  Menu,
  HeadingButton,
  ParagraphButton,
  BlockquoteButton,
  BulletListButton,
  OrderedListButton,
  TodoListButton,
  BoldButton,
  ItalicButton,
  MenuGroup,
  UndoButton,
  RedoButton,
} from '@bangle.dev/react-menu'
import { chakra, Box } from '@chakra-ui/react'

import '@bangle.dev/core/style.css'
import '@bangle.dev/tooltip/style.css'
import '@bangle.dev/react-menu/style.css'
import '@bangle.dev/react-emoji-suggest/style.css'

const menuKey = new PluginKey('menuKey')
const emojiSuggestKey = new PluginKey('emojiSuggestKey')

const CMenu = chakra(Menu)

export function Editor({ onChange }: { onChange: (html: string) => void }) {
  const [editor, setEditor] = useState()
  const editorState = useEditorState({
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
              emojis: group.emojis.filter(([emojiAlias]: [string]) =>
                emojiAlias.includes(queryText)
              ),
            }))
            .filter((group: any) => group.emojis.length > 0)
        },
        markName: 'emojiSuggest',
        tooltipRenderOpts: {
          placement: 'bottom',
        },
      }),
    ],
    initialValue: ``,
  })

  return (
    <Box
      bg="white"
      border="1px solid white"
      shadow="0px 3px 8px rgba(50, 50, 71, 0.05)"
      rounded="6px"
      w="640px"
      _focusWithin={{ boxShadow: '0 0 0 1px #45BCC8' }}
      transition="0.1s"
    >
      <StaticMenu
        editor={editor}
        renderMenu={() => (
          <CMenu
            bg="transparent"
            color="black"
            borderBottomColor="blackAlpha.100"
            borderBottomWidth="1px"
            rounded="0"
            px="0.5rem"
          >
            <MenuGroup>
              <UndoButton />
              <RedoButton />
            </MenuGroup>
            <MenuGroup>
              <BoldButton />
              <ItalicButton />
            </MenuGroup>
            <MenuGroup>
              <ParagraphButton />
              <BlockquoteButton />
              <HeadingButton level={3} />
              <HeadingButton level={4} />
            </MenuGroup>
            <BulletListButton />
            <OrderedListButton />
            <TodoListButton />
          </CMenu>
        )}
      />
      <BangleEditor state={editorState} onReady={setEditor}>
        <EmojiSuggest emojiSuggestKey={emojiSuggestKey} />
      </BangleEditor>
    </Box>
  )
}

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
