import { useState } from 'react'
import {
  Text,
  VStack,
  List,
  ListItem,
  ListIcon,
  Link as ChakraLink,
  IconButton,
} from '@chakra-ui/react'

import { useRouter } from 'next/router'
import Link from 'next/link'

import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'

import DashboardIcon from 'svg/icons/dashboard.svg'
import DashboardSelectedIcon from 'svg/icons/dashboard-selected.svg'
import ActivitiesIcon from 'svg/icons/activities.svg'
import ActivitiesSelectedIcon from 'svg/icons/activities-selected.svg'
import CalendarIcon from 'svg/icons/calendar.svg'
import CalendarSelectedIcon from 'svg/icons/calendar-selected.svg'

import { motionComponent } from 'lib/utils'

const menu = [
  {
    id: 'dashboard',
    text: 'Dashboard',
    icon: DashboardIcon,
    iconSelected: DashboardSelectedIcon,
  },
  {
    id: 'activities',
    text: 'My activities',
    icon: ActivitiesIcon,
    iconSelected: ActivitiesSelectedIcon,
  },
  {
    id: 'calendar',
    text: 'Calendar',
    icon: CalendarIcon,
    iconSelected: CalendarSelectedIcon,
  },
]

const MotionVStack = motionComponent(VStack)
const MotionText = motionComponent(Text)
const MotionListItem = motionComponent(ListItem)

export const SidePanel = () => {
  const router = useRouter()
  const selected = getSelectedIndex(router.route)
  const [isCollapsed, setCollapsed] = useState(false)

  const toggleCollapse = () => {
    setCollapsed(!isCollapsed)
  }

  return (
    <MotionVStack
      bg="white"
      animate={{ width: isCollapsed ? '52px' : '240px' }}
      h="100%"
      alignItems="flex-start"
      pt="2rem"
      pos="relative"
    >
      <IconButton
        pos="absolute"
        variant="ghost"
        bg="#D2D2D4"
        aria-label="Collapse panel"
        icon={isCollapsed ? <ChevronRightIcon color="white" /> : <ChevronLeftIcon color="white" />}
        onClick={toggleCollapse}
        isRound
        size="xs"
        right="-12px"
        top="15px"
      />
      <List spacing="0.8rem">
        {menu.map((item: any, index: number) => {
          const isSelected = selected === index

          return (
            <MotionListItem
              key={item.id}
              flexDir="row"
              display="flex"
              alignItems="center"
              borderLeft={`3px solid ${isSelected ? '#47BCC8' : '#FFF'}`}
              animate={{ paddingLeft: isCollapsed ? '13px' : '29px' }}
            >
              <Link as={`/${item.id}`} href={`/${item.id}`}>
                <ChakraLink
                  color={isSelected ? '#47BCC8' : 'black'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  title={item.text}
                  display="flex"
                  alignItems="center"
                  pos="relative"
                >
                  <ListIcon
                    as={isSelected ? item.iconSelected : item.icon}
                    w="20px"
                    h="20px"
                    color="#47BCC8"
                  />
                  <MotionText
                    pos="absolute"
                    left="30px"
                    width="100px"
                    animate={{
                      opacity: isCollapsed ? '0' : '1',
                      marginLeft: isCollapsed ? '-150px' : '0',
                    }}
                  >
                    {item.text}
                  </MotionText>
                </ChakraLink>
              </Link>
            </MotionListItem>
          )
        })}
      </List>
    </MotionVStack>
  )
}

const getSelectedIndex = (route: string) => {
  let selected = -1

  menu.forEach((item, index) => {
    if (route.includes(item.id)) {
      selected = index
    }
  })

  return selected
}
