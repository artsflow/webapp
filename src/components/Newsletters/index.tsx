import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import { Compose, Audience, Sent } from './tabs'

export const Newsletters = () => (
  <Tabs colorScheme="unstyled" w="full">
    <TabList>
      <TabStyled pl="0">Compose</TabStyled>
      <TabStyled>Sent</TabStyled>
      <TabStyled>Audience</TabStyled>
    </TabList>

    <TabPanels>
      <TabPanel pl="0">
        <Compose />
      </TabPanel>
      <TabPanel pl="0">
        <Audience />
      </TabPanel>
      <TabPanel pl="0">
        <Sent />
      </TabPanel>
    </TabPanels>
  </Tabs>
)

const TabStyled = (props: any) => (
  <Tab
    _focus={{ outline: 'none' }}
    _selected={{ borderBottomColor: 'black', textShadow: '0 0 black, 0.03ex 0 black' }}
    _hover={{ textShadow: '0 0 black, 0.03ex 0 black' }}
    {...props}
  />
)
