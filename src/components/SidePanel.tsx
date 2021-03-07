import { VStack, List, ListItem, ListIcon, Link as ChakraLink } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import DashboardIcon from 'svg/icons/dashboard.svg'
import ActivitiesIcon from 'svg/icons/activities.svg'
import CalendarIcon from 'svg/icons/calendar.svg'

const menu = [
  {
    id: 'dashboard',
    text: 'Dashboard',
    icon: DashboardIcon,
  },
  {
    id: 'activities',
    text: 'My activities',
    icon: ActivitiesIcon,
  },
  {
    id: 'calendar',
    text: 'Calendar',
    icon: CalendarIcon,
  },
]

export const SidePanel = () => {
  const router = useRouter()
  const selected = getSelectedIndex(router.route)
  console.log(selected)

  return (
    <VStack bg="white" w="240px" h="100%" alignItems="flex-start" pt="2rem">
      <List spacing="0.8rem">
        {menu.map((item: any) => (
          <ListItem
            key={item.id}
            flexDir="row"
            display="flex"
            alignItems="center"
            borderLeft="3px solid #47BCC8"
            px="calc(2rem - 3px)"
          >
            <Link as={`/${item.id}`} href={`/${item.id}`}>
              <ChakraLink>
                <ListIcon as={item.icon} w="20px" h="20px" />
                {item.text}
              </ChakraLink>
            </Link>
          </ListItem>
        ))}
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
