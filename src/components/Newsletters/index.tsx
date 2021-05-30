import { useState } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Icon } from '@chakra-ui/react'
import { RiMailSendFill, RiInboxArchiveFill } from 'react-icons/ri'
import { IoIosPeople, IoIosStats } from 'react-icons/io'
import { useRouter } from 'next/router'

import { Compose, Audience, Sent, Stats } from './tabs'

const TABS = ['compose', 'sent', 'audience', 'stats']

const getParam = (params = []) => {
  const [param] = params
  const index = TABS.findIndex((p) => p === param)
  return index > 0 ? index : 0
}

export const Newsletters = () => {
  const router = useRouter()
  const param = getParam(router.query.params as [])
  const [tabIndex, setTabIndex] = useState(param)

  const handleChange = (index: number) => {
    const url = `/newsletters/${TABS[index]}`
    router.push(url, url, { shallow: true })
    setTabIndex(index)
  }

  return (
    <Tabs colorScheme="unstyled" w="full" onChange={handleChange} index={tabIndex}>
      <TabList>
        <TabStyled pl="0">
          <Icon as={RiMailSendFill} mr="0.5rem" />
          Compose
        </TabStyled>
        <TabStyled>
          <Icon as={RiInboxArchiveFill} mr="0.5rem" />
          Sent
        </TabStyled>
        <TabStyled>
          <Icon as={IoIosPeople} mr="0.5rem" />
          Audience
        </TabStyled>
        <TabStyled>
          <Icon as={IoIosStats} mr="0.5rem" />
          Stats
        </TabStyled>
      </TabList>

      <TabPanels>
        <TabPanel pl="0">
          <Compose />
        </TabPanel>
        <TabPanel pl="0">
          <Sent />
        </TabPanel>
        <TabPanel pl="0">
          <Audience />
        </TabPanel>
        <TabPanel pl="0">
          <Stats />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

const TabStyled = (props: any) => (
  <Tab
    _focus={{ outline: 'none' }}
    _selected={{ borderBottomColor: 'black', textShadow: '0 0 black, 0.03ex 0 black' }}
    _hover={{ textShadow: '0 0 black, 0.03ex 0 black' }}
    {...props}
  />
)
