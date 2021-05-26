import { Box } from '@chakra-ui/react'
import { useProseMirror, ProseMirror } from 'use-prosemirror'

import { Toolbar, opts } from './components'

export function Editor() {
  const [state, setState] = useProseMirror(opts)

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
      <Toolbar state={state} onChange={setState} />
      <ProseMirror state={state} onChange={setState} />
    </Box>
  )
}
