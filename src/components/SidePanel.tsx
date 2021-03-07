import { VStack, List, ListItem, ListIcon, Link as ChakraLink } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import DashboardIcon from 'svg/icons/dashboard.svg'
import DashboardSelectedIcon from 'svg/icons/dashboard-selected.svg'
import ActivitiesIcon from 'svg/icons/activities.svg'
import ActivitiesSelectedIcon from 'svg/icons/activities-selected.svg'
import CalendarIcon from 'svg/icons/calendar.svg'
import CalendarSelectedIcon from 'svg/icons/calendar-selected.svg'

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

export const SidePanel = () => {
  const router = useRouter()
  const selected = getSelectedIndex(router.route)

  return (
    <VStack bg="white" w="240px" h="100%" alignItems="flex-start" pt="2rem">
      <List spacing="0.8rem">
        {menu.map((item: any, index: number) => {
          const isSelected = selected === index

          return (
            <ListItem
              key={item.id}
              flexDir="row"
              display="flex"
              alignItems="center"
              borderLeft={`3px solid ${isSelected ? '#47BCC8' : '#FFF'}`}
              px="calc(2rem - 3px)"
            >
              <Link as={`/${item.id}`} href={`/${item.id}`}>
                <ChakraLink
                  color={isSelected ? '#47BCC8' : 'black'}
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  <ListIcon
                    as={isSelected ? item.iconSelected : item.icon}
                    w="20px"
                    h="20px"
                    color="#47BCC8"
                  />
                  {item.text}
                </ChakraLink>
              </Link>
            </ListItem>
          )
        })}
      </List>
    </VStack>
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
