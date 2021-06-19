import { useState, useEffect } from 'react'
import {
  Text,
  VStack,
  List,
  ListItem,
  ListIcon,
  Link as ChakraLink,
  IconButton,
  Divider,
} from '@chakra-ui/react'

import { useRouter } from 'next/router'
import Link from 'next/link'
import { useWindowSize } from 'rooks'

import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import { BiMailSend } from 'react-icons/bi'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'

import DashboardIcon from 'svg/icons/dashboard.svg'
import DashboardSelectedIcon from 'svg/icons/dashboard-selected.svg'
import ActivitiesIcon from 'svg/icons/activities.svg'
import ActivitiesSelectedIcon from 'svg/icons/activities-selected.svg'
import CalendarIcon from 'svg/icons/calendar.svg'
import CalendarSelectedIcon from 'svg/icons/calendar-selected.svg'
import CardIcon from 'svg/icons/card.svg'
import CardSelectedIcon from 'svg/icons/card-selected.svg'

import { motionComponent } from 'lib/utils'
import { trackSidepanelToggle } from 'analytics'

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
    id: 'newsletters',
    text: 'Newsletters',
    icon: BiMailSend,
    iconSelected: BiMailSend,
  },
  {
    id: 'calendar',
    text: 'Calendar',
    icon: CalendarIcon,
    iconSelected: CalendarSelectedIcon,
  },
  {
    id: 'divider',
  },
  {
    id: 'payouts',
    text: 'Payouts',
    icon: CardIcon,
    iconSelected: CardSelectedIcon,
  },
  {
    id: 'divider',
  },
  {
    id: 'support',
    text: 'Support',
    icon: IoChatbubbleEllipsesOutline,
    iconSelected: IoChatbubbleEllipsesOutline,
  },
]

const MotionVStack = motionComponent(VStack)
const MotionText = motionComponent(Text)
const MotionListItem = motionComponent(ListItem)

export const SidePanel = () => {
  const router = useRouter()
  const selected = getSelectedIndex(router.route)
  const [isCollapsed, setCollapsed] = useState(false)
  const { outerWidth } = useWindowSize()

  const toggleCollapse = () => {
    setCollapsed(!isCollapsed)
    trackSidepanelToggle(!isCollapsed)
  }

  useEffect(() => {
    if (Number(outerWidth) < 1220 && !isCollapsed) {
      setCollapsed(true)
    }
    if (Number(outerWidth) > 1440 && isCollapsed) {
      setCollapsed(false)
    }
  }, [outerWidth])

  return (
    <MotionVStack
      bg="white"
      animate={{ width: isCollapsed ? '52px' : '240px' }}
      h="100%"
      alignItems="flex-start"
      pt="2rem"
      pos="relative"
      boxShadow="0px 3px 8px -1px rgba(50, 50, 71, 0.05)"
      justifyContent="space-between"
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
        bottom="32px"
        zIndex="2"
      />
      <List spacing="0.8rem">
        {menu.map((item: any, index: number) => {
          const isSelected = selected === index
          return (
            <MotionListItem
              key={`${item.id}-${index + 1}`}
              flexDir="row"
              display="flex"
              alignItems="center"
              borderLeft={`3px solid ${isSelected ? '#47BCC8' : '#FFF'}`}
              animate={{ paddingLeft: isCollapsed ? '13px' : '29px' }}
            >
              {item.id === 'divider' ? (
                <Divider w={isCollapsed ? '20px' : '130px'} />
              ) : (
                <Link as={`/${item.id}`} href={`/${item.id}`} passHref>
                  <ChakraLink
                    color={isSelected ? '#47BCC8' : 'black'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    title={item.text}
                    display="flex"
                    alignItems="center"
                    pos="relative"
                    _focus={{
                      outline: 0,
                    }}
                    _hover={{
                      color: '#47BCC8',
                    }}
                  >
                    <ListIcon
                      color={isSelected ? '#47BCC8' : 'black'}
                      as={isSelected ? item.iconSelected : item.icon}
                      w="20px"
                      h="20px"
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
              )}
            </MotionListItem>
          )
        })}
      </List>
      <VStack pb="1rem">
        <Link as="/terms" href="/terms" passHref>
          <ChakraLink>
            <MotionText
              as="p"
              fontSize="xs"
              animate={{ marginLeft: isCollapsed ? '15px' : '30px' }}
            >
              {isCollapsed ? 'ToS' : 'Terms of service'}
            </MotionText>
          </ChakraLink>
        </Link>
      </VStack>
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
