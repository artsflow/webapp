import React, { useState } from 'react'
import { BangleEditor, useEditorState } from '@bangle.dev/react'
import { PluginKey, Plugin } from '@bangle.dev/core'
import { corePlugins, coreSpec } from '@bangle.dev/core/utils/core-components'
import { toHTMLString } from '@bangle.dev/core/utils/pm-utils'
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

const menuKey = new PluginKey('menuKey')

const CMenu = chakra(Menu)

export function Editor({ onChange }: { onChange: (html: string) => void }) {
  const [editor, setEditor] = useState()
  const editorState = useEditorState({
    specs: coreSpec(),
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
      <BangleEditor state={editorState} onReady={setEditor} />
    </Box>
  )
}
