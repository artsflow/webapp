import { IconButton, HStack } from '@chakra-ui/react'
import React, { ReactElement } from 'react'
import {
  MdFormatBold,
  MdFormatItalic,
  // MdFormatListBulleted,
  // MdFormatListNumbered,
  // MdFormatQuote,
  // MdFormatUnderlined,
  // MdLooksOne,
  // MdLooksTwo,
} from 'react-icons/md'
import { EditorState, Transaction } from 'prosemirror-state'
import { schema } from 'prosemirror-schema-basic'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap, Command, toggleMark } from 'prosemirror-commands'
import { MarkType } from 'prosemirror-model'
import { history, redo, undo } from 'prosemirror-history'
import { useProseMirror } from 'use-prosemirror'

const toggleMarkCommand = (mark: MarkType): Command => (
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined
) => toggleMark(mark)(state, dispatch)

const toggleBold = toggleMarkCommand(schema.marks.strong)
const toggleItalic = toggleMarkCommand(schema.marks.em)

export const opts: Parameters<typeof useProseMirror>[0] = {
  schema,
  plugins: [
    history(),
    keymap({
      ...baseKeymap,
      'Mod-z': undo,
      'Mod-y': redo,
      'Mod-Shift-z': redo,
      'Mod-b': toggleBold,
      'Mod-i': toggleItalic,
    }),
  ],
}

const isBold = (state: EditorState): boolean => isMarkActive(state, schema.marks.strong)

const isItalic = (state: EditorState): boolean => isMarkActive(state, schema.marks.em)

const isMarkActive = (state: EditorState, mark: MarkType): boolean => {
  const { from, $from, to, empty } = state.selection
  return empty
    ? !!mark.isInSet(state.storedMarks || $from.marks())
    : state.doc.rangeHasMark(from, to, mark)
}

const Button = (props: { icon: ReactElement; isActive: boolean; onClick: () => void }) => {
  const { icon, isActive } = props
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    props.onClick()
  }

  return (
    <IconButton
      isActive={isActive}
      onMouseDown={handleMouseDown}
      icon={icon}
      size="xs"
      fontSize="1rem"
      aria-label="toolbar-button"
    />
  )
}

export const Toolbar = ({ state, onChange }: any) => (
  <HStack spacing="0.3rem" borderBottom="1px solid #D3D3D3" p="0.5rem" px="1rem">
    <Button
      isActive={isBold(state)}
      onClick={() => toggleBold(state, (tr) => onChange(state.apply(tr)))}
      icon={<MdFormatBold />}
    />
    <Button
      isActive={isItalic(state)}
      onClick={() => toggleItalic(state, (tr) => onChange(state.apply(tr)))}
      icon={<MdFormatItalic />}
    />
  </HStack>
)
