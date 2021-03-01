import { useContext } from 'react'
import {
  Box,
  Text,
  Heading,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  HStack,
  VStack,
  Button,
} from '@chakra-ui/react'
import humanize from 'humanize-duration'
import { RRuleSet, rrulestr } from 'rrule'
import { format } from 'date-fns'
import { isEmpty } from 'lodash'

import { AddressInfo, ImageGallery } from 'components'
import { MockiPhone } from './Phone'
import { Context } from './machine'
import { ruleText } from './steps/Frequency'

export function Preview() {
  const { context } = useContext(Context) as any
  const {
    title,
    description,
    category,
    duration,
    capacity,
    price,
    address,
    frequency,
    images,
  } = context

  const rruleSet = new RRuleSet()
  frequency.rrules.forEach((r: string) => rruleSet.rrule(rrulestr(r)))

  return (
    <MockiPhone>
      {isEmpty(images) ? (
        <Skeleton h="280px" startColor="grey" endColor="grey" />
      ) : (
        <Box pos="relative" height="280px">
          <ImageGallery
            images={images.map(
              (img: string) => `https://ik.imagekit.io/artsflow/tr:w-280,h-280,fo-auto/${img}`
            )}
          />
        </Box>
      )}

      <Box p="4">
        <HStack mt="-60px" mb="30px" justify="flex-end">
          <Text p="1" px="2" bg="white" fontSize="xs" zIndex="2">
            #{category}
          </Text>
        </HStack>

        <Heading mb="2" size="md" lineHeight="1.2">
          {title || <SkeletonText noOfLines={1} startColor="grey" endColor="grey" />}
        </Heading>

        {duration > 0 && (
          <HStack fontSize="xs">
            <Text>{humanize(duration * 1000 * 60)}</Text>
            <Text>for up to {capacity} people</Text>
          </HStack>
        )}

        {!isEmpty(frequency.rrules) && (
          <VStack mt="4" w="full" align="flex-start" spacing="0">
            {frequency.rrules.map((r: string) => (
              <Text key={r} fontSize="xs">
                {ruleText(r)}
              </Text>
            ))}
          </VStack>
        )}

        {price > 0 && (
          <HStack justify="space-between" mt="4">
            <Text>£{price}</Text>
            <HStack>
              <Text fontSize="xs">by John Doe</Text>
              <SkeletonCircle startColor="grey" endColor="grey" />
            </HStack>
          </HStack>
        )}

        {description ? (
          <Description text={description} />
        ) : (
          <SkeletonText noOfLines={6} startColor="grey" endColor="grey" />
        )}
      </Box>

      {address.position && <AddressInfo {...address} withAddress={false} defaultZoom={13} />}

      {!isEmpty(frequency.rrules) && (
        <VStack p="4" mb="8" align="flex-start">
          <Text fontWeight="bold">Booking dates:</Text>
          <Box mt="2" mb="8" h="100px" overflowY="scroll" w="full">
            {rruleSet.all().map((d) => (
              <Text
                key={d.toString()}
                fontSize="xs"
                textDecor={frequency.exdate.includes(d.toString()) ? 'line-through' : ''}
                fontWeight={frequency.exdate.includes(d.toString()) ? 'bold' : 'normal'}
              >
                {format(d, 'HH:mm EEEE dd MMMM yyyy')}
              </Text>
            ))}
          </Box>
          <Button w="full">Book now</Button>
        </VStack>
      )}
    </MockiPhone>
  )
}

const Description = ({ text }: { text: string }) => (
  <Box mt="4">
    {text.split('\n').map((p: string) => (
      <Text key={p} fontSize="xs" mb="4">
        {p}
      </Text>
    ))}
  </Box>
)
