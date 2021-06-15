import { Button, Popover, PopoverContent, PopoverTrigger, Portal } from '@chakra-ui/react'
import * as React from 'react'
import { FeedbackForm } from './FeedbackForm'

export const FeedbackPopover = () => {
  const initialFocusRef = React.useRef(null)
  return (
    <Popover initialFocusRef={initialFocusRef}>
      <PopoverTrigger>
        <Button variant="outline">Feedback</Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent boxShadow="xl" p="3" _focus={{ outline: 'none' }}>
          <FeedbackForm forwardedRef={initialFocusRef} />
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
