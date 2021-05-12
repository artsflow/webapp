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
    info: (
      <>
        <Text>Add the location where your activity will take place.</Text>
        <Text mt="1rem">
          <b>Your privacy is enabled</b> by default, The exact address will be shared only with
          people who booked your activity.
        </Text>
      </>
    ),
  },
  images: {
    heading: 'Images',
    info: 'Add the best images that describes your activity',
  },
  duration: {
    heading: 'Duration',
    info: 'The total time of the activity',
  },
  dates: {
    heading: 'Date and time',
    info: (
      <>
        <Text>Set the date and time of your activity</Text>
        <Text>You can add many as you want.</Text>
      </>
    ),
  },
  capacity: {
    heading: 'Capacity',
    info: 'Add the maximum capactiy of your activity',
  },
  price: {
    heading: 'Price',
    info: 'Chose the price for each member or make it free',
  },
}
