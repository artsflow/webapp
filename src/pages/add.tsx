import { useState, useCallback } from 'react'
import { gql } from 'graphql-request'
import { useForm } from 'react-hook-form'
import {
  Box,
  Text,
  Heading,
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
  FormErrorMessage,
  FormLabel,
  FormControl,
  List,
  ListItem,
} from '@chakra-ui/core'
import { SearchIcon } from '@chakra-ui/icons'
import { isEmpty } from 'lodash'
import GoogleMapReact from 'google-map-react'

import { Meta } from 'components'
import { client } from 'services/client'
import { GCP_MAPS_KEY } from 'lib/config'

const ADD_SERVICE = gql`
  mutation addService($input: ServiceInput!) {
    addService(input: $input)
  }
`

export default function AddService() {
  const { register, handleSubmit, errors, formState } = useForm()
  const onSubmit = async (data: any) => {
    console.log(data)
    if (!data) return
    const variables = { input: { ...data, published: false } }
    const res = await client.request(ADD_SERVICE, variables)
    console.log(res)
  }

  return (
    <>
      <Meta title="Add service" />
      <Heading size="md">Add service</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name}>
          <VStack mt="8" w="md" alignItems="flex-start" spacing="4">
            <Box w="full">
              <FormLabel htmlFor="title">Title</FormLabel>
              <Input
                name="title"
                placeholder="Add title"
                size="md"
                ref={register({ required: true, maxLength: 80 })}
              />
            </Box>
            <Box w="full">
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                name="description"
                placeholder="Add description"
                size="md"
                ref={register({ required: true, maxLength: 200 })}
              />
            </Box>
            <AddressLookup />
            <Button type="submit" isLoading={formState.isSubmitting}>
              Submit
            </Button>
          </VStack>
          <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
        </FormControl>
      </form>
    </>
  )
}

const GET_ADDRESS = gql`
  query getAddress($input: String!) {
    getAddress(input: $input) {
      id
      streetNumber
      streetName
      municipality
      extendedPostalCode
      country
      countryCode
      freeformAddress
      position {
        lat
        lon
        geohash
      }
    }
  }
`

const AddressLookup = () => {
  const [selectedAddress, setSelectedAddress]: any = useState({})
  const [lookupAddress, setLookupAddress] = useState('')
  const [addresses, setAddresses] = useState([])
  const [isLoading, setLoading] = useState(false)

  const handleClick = useCallback(async () => {
    if (!lookupAddress) return
    setLoading(true)
    const result = await client.request(GET_ADDRESS, { input: lookupAddress })
    setAddresses(result.getAddress)
    setSelectedAddress({})
    setLoading(false)
  }, [lookupAddress])

  const showList = addresses.length > 0 && isEmpty(selectedAddress)

  return (
    <Box w="full">
      <FormLabel htmlFor="address">Address lookup</FormLabel>
      <HStack>
        <Input
          placeholder="Search address"
          value={lookupAddress}
          onChange={(e) => setLookupAddress(e.target.value)}
          size="md"
        />
        <Button onClick={handleClick} isLoading={isLoading}>
          <SearchIcon />
        </Button>
      </HStack>
      {!isEmpty(selectedAddress) && (
        <Box mt="2" p="2">
          <AddressInfo {...selectedAddress} />
        </Box>
      )}
      {showList && (
        <List spacing="2">
          {addresses.map((a: any) => (
            <ListItem key={a.id}>
              <Button variant="outline" onClick={() => setSelectedAddress(a)}>
                {a.freeformAddress}
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

const Marker: React.FC<any> = () => <Box w="8" h="8" borderRadius="16px" bg="red.400" />

const AddressInfo = ({
  streetNumber,
  streetName,
  extendedPostalCode,
  municipality,
  countryCode,
  country,
  position: { lat, lon: lng },
}: any) => (
  <>
    <Text>
      {streetNumber} {streetName}, {municipality}, {extendedPostalCode}, {countryCode}, {country}{' '}
    </Text>
    <Box w="full" h="360px" border="1px" mt="2">
      <GoogleMapReact
        defaultCenter={{ lat, lng }}
        defaultZoom={16}
        bootstrapURLKeys={{ key: GCP_MAPS_KEY as string }}
      >
        <Marker lat={lat} lng={lng} />
      </GoogleMapReact>
    </Box>
  </>
)
