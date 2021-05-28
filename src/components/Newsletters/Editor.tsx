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
  TodoListButton,
  BoldButton,
  ItalicButton,
  MenuGroup,
  UndoButton,
  RedoButton,
} from '@bangle.dev/react-menu'
import { chakra, Box } from '@chakra-ui/react'
import Select from 'react-select'
import { uniqBy } from 'lodash'

import '@bangle.dev/core/style.css'
import '@bangle.dev/tooltip/style.css'
import '@bangle.dev/react-menu/style.css'
import '@bangle.dev/react-emoji-suggest/style.css'

import { ARTSFLOW_URL } from 'lib/config'
import { getEditorConfig, emojiSuggestKey, selectStylesEditor } from './utils'

const CMenu = chakra(Menu)
const CSelect = chakra(Select)
const CMenuGroup = chakra(MenuGroup, {
  baseStyle: {
    paddingX: '10px',
    borderRightColor: 'gray.200',
  },
})

export function Editor({ onChange, activities }: any) {
  const [editor, setEditor] = useState()
  const [selectValue, setSelectValue] = useState(null)
  const editorState = useEditorState(getEditorConfig(onChange))

  const options = activities
    ? uniqBy(
        activities?.map(({ id, title }: any) => ({
          value: id,
          label: title,
        })),
        'value'
      )
    : []

  const handleOnReady = (s: any) => {
    setEditor(s)
    onChange(toHTMLString(s.view.state))
  }

  const handleInsertLink = (props: any) => {
    const { value, label } = props || {}
    if (!value) return

    const activityLink = `${ARTSFLOW_URL}/a/${value}`
    const { view } = editor as any
    const attrs = { title: label, href: activityLink }
    const { schema } = view.state
    const node = schema.text(attrs.title, [schema.marks.link.create(attrs)])
    view.dispatch(view.state.tr.replaceSelectionWith(node, false))

    setSelectValue(null)
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
              <HeadingButton level={4} />
            </CMenuGroup>

            <BulletListButton />
            <OrderedListButton />
            <TodoListButton />

            <CSelect
              isSearchable={false}
              placeholder="Insert activity link"
              ml="1rem"
              w="240px"
              onChange={handleInsertLink}
              options={options}
              value={selectValue}
              styles={selectStylesEditor}
            />
          </CMenu>
        )}
      />
      <BangleEditor state={editorState} onReady={handleOnReady}>
        <EmojiSuggest emojiSuggestKey={emojiSuggestKey} />
      </BangleEditor>
    </Box>
  )
}
