import { IconButton, HStack } from '@chakra-ui/react'
import React, { ReactElement } from 'react'
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatListBulleted,
  // MdFormatListNumbered,
  // MdFormatQuote,
  // MdLooksOne,
  // MdLooksTwo,
} from 'react-icons/md'
import { EditorState, Transaction } from 'prosemirror-state'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap, Command, toggleMark, chainCommands, exitCode } from 'prosemirror-commands'
import { MarkType } from 'prosemirror-model'
import { history, redo, undo } from 'prosemirror-history'
import { useProseMirror } from 'use-prosemirror'

import { schema } from './schema'
import {
  isBlockActive,
  setListTypeBullet,
  insertNodeLineBreak,
  insertNodeHorizontalRule,
} from './commands'

const Button = (props: {
  icon: ReactElement
  isActive: boolean
  ariaLabel: string
  onClick: () => void
}) => {
  const { icon, isActive, ariaLabel } = props
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
      aria-label={ariaLabel}
    />
  )
}

const toggleMarkCommand = (mark: MarkType): Command => (
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined
) => toggleMark(mark)(state, dispatch)

const isMarkActive = (state: EditorState, mark: MarkType): boolean => {
  const { from, $from, to, empty } = state.selection
  return empty
    ? !!mark.isInSet(state.storedMarks || $from.marks())
    : state.doc.rangeHasMark(from, to, mark)
}

const isBold = (state: EditorState): boolean => isMarkActive(state, schema.marks.strong)
const isItalic = (state: EditorState): boolean => isMarkActive(state, schema.marks.em)
const isUnderline = (state: EditorState): boolean => isMarkActive(state, schema.marks.underline)
const isListBullet = (state: EditorState): boolean =>
  isBlockActive(schema.nodes.list, { type: 'bullet' })(state)

const toggleBold = toggleMarkCommand(schema.marks.strong)
const toggleItalic = toggleMarkCommand(schema.marks.em)
const toggleUnderline = toggleMarkCommand(schema.marks.underline)
// const toggleList = setListTypeBullet(schema.marks.bullet)

export const Toolbar = ({ state, onChange }: any) => (
  <HStack spacing="0.3rem" borderBottom="1px solid #D3D3D3" p="0.5rem" px="1rem">
    <Button
      isActive={isBold(state)}
      onClick={() => toggleBold(state, (tr) => onChange(state.apply(tr)))}
      icon={<MdFormatBold />}
      ariaLabel="toggle-bold"
    />
    <Button
      isActive={isItalic(state)}
      onClick={() => toggleItalic(state, (tr) => onChange(state.apply(tr)))}
      icon={<MdFormatItalic />}
      ariaLabel="toggle-italic"
    />
    <Button
      isActive={isUnderline(state)}
      onClick={() => toggleUnderline(state, (tr) => onChange(state.apply(tr)))}
      icon={<MdFormatUnderlined />}
      ariaLabel="toggle-underline"
    />
    <Button
      isActive={isListBullet(state)}
      onClick={() => setListTypeBullet(state, (tr) => onChange(state.apply(tr)))}
      icon={<MdFormatListBulleted />}
      ariaLabel="toggle-list-bullet"
    />
  </HStack>
)

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
      'Mod-u': toggleUnderline,
      'Mod-Enter': chainCommands(exitCode, insertNodeLineBreak),
      'Mod-_': insertNodeHorizontalRule,
    }),
  ],
}
