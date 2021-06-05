import React, { useState } from 'react'
import { BangleEditor, useEditorState } from '@bangle.dev/react'
import { EmojiSuggest } from '@bangle.dev/react-emoji-suggest'
import { toHTMLString } from '@bangle.dev/core/utils/pm-utils'
import {
  StaticMenu,
  Menu,
  HeadingButton,
  ParagraphButton,
  BlockquoteButton,
  BulletListButton,
  OrderedListButton,
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

import { getEditorConfig, emojiSuggestKey } from './utils'

const CMenu = chakra(Menu)
const CMenuGroup = chakra(MenuGroup, {
  baseStyle: {
    paddingX: '10px',
    borderRightColor: 'gray.200',
  },
})

export function Editor({ onChange, value }: any) {
  const [editor, setEditor] = useState()
  const editorState = useEditorState(getEditorConfig(onChange, value))

  const handleOnReady = (s: any) => {
    setEditor(s)
    onChange?.(toHTMLString(s.view.state))
  }

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
            p="0.5rem"
          >
            <CMenuGroup>
              <UndoButton />
              <RedoButton />
            </CMenuGroup>
            <CMenuGroup>
              <BoldButton />
              <ItalicButton />
            </CMenuGroup>
            <CMenuGroup>
              <ParagraphButton />
              <BlockquoteButton />
              <HeadingButton level={3} />
            </CMenuGroup>
            <BulletListButton />
            <OrderedListButton />
          </CMenu>
        )}
      />
      <BangleEditor state={editorState} onReady={handleOnReady}>
        <EmojiSuggest emojiSuggestKey={emojiSuggestKey} />
      </BangleEditor>
    </Box>
  )
}
