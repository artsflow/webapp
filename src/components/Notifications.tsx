import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody } from '@chakra-ui/react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const Notifications = ({ onClose, isOpen }: Props) => (
  <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
    <DrawerOverlay>
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Notifications</DrawerHeader>
        <DrawerBody>
          <p>coming soon...</p>
        </DrawerBody>
      </DrawerContent>
    </DrawerOverlay>
  </Drawer>
)
