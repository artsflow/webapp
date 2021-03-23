import { Text } from '@chakra-ui/react'

interface HelpInfo {
  heading: string
  info: any
}

interface HelpMap {
  [key: string]: HelpInfo
}

export const help: HelpMap = {
  edit: {
    heading: 'Edit your activiy',
    info:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
  },
  category: {
    heading: 'Category',
    info: 'Select the category that describes better your activity',
  },
  details: {
    heading: 'Make your activity stick',
    info: (
      <>
        <Text>
          Set a catchy <b>title</b> but descriptive.
        </Text>
        <Text>Describe your activity in detail.</Text>
      </>
    ),
  },
  location: {
    heading: 'Location',
    info: 'Lorem ipsum here...',
  },
  images: {
    heading: 'Images',
    info: 'Lorem ipsum here...',
  },
  duration: {
    heading: 'Duration',
    info: 'Lorem ipsum here...',
  },
  frequency: {
    heading: 'Frequency',
    info: 'Lorem ipsum here...',
  },
  capacity: {
    heading: 'Capacity',
    info: 'Lorem ipsum here...',
  },
  price: {
    heading: 'Price',
    info: 'Lorem ipsum here...',
  },
}
